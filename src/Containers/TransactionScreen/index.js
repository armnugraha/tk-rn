/* eslint-disable no-console */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  ToastAndroid,
  ActivityIndicator
} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { RNCamera } from 'react-native-camera';
import { Container, Header, Content, List, ListItem, Button, Tab, Tabs, TabHeading, Left, Body, Right, Title, Item, Input, Footer, FooterTab, Separator, Card, CardItem } from 'native-base';
import { FlatList } from 'react-native-gesture-handler';
import Api from '../../libs/Api';

const flashModeOrder = {
  off: 'torch',
  torch: 'off',
};

export default class CameraScreen extends React.Component {
	state = {
		flash: 'off',
		zoom: 0,
		autoFocus: 'on',
		autoFocusPoint: {
			normalized: { x: 0.5, y: 0.5 }, // normalized values required for autoFocusPointOfInterest
			drawRectPosition: {
				x: Dimensions.get('window').width * 0.5 - 32,
				y: Dimensions.get('window').height * 0.5 - 32,
			},
		},
		depth: 0,
		type: 'back',
		whiteBalance: 'auto',
		ratio: '16:9',
		barcodes: [],
        listTransaction: [{name:"ar"}],
        loading:false,
        itemProduct:[],

        itemHrgPcs:0,
        itemHrgDz:0,
        itemHrgBx:0,
        itemHrgPck:0,
        
        totalItem:0,
        
        name_product:"",
        jml_product:0,
        satuan_product:"",
        satuan_hrg_product:0,

        totalCalculate:0,
	};

  toggleFlash() {
    this.setState({
      flash: flashModeOrder[this.state.flash],
    });
  }

  toggleFocus() {
    this.setState({
      autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
    });
  }

  touchToFocus(event) {
    const { pageX, pageY } = event.nativeEvent;
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const isPortrait = screenHeight > screenWidth;

    let x = pageX / screenWidth;
    let y = pageY / screenHeight;
    // Coordinate transform for portrait. See autoFocusPointOfInterest in docs for more info
    if (isPortrait) {
      x = pageY / screenHeight;
      y = -(pageX / screenWidth) + 1;
    }

    this.setState({
      autoFocusPoint: {
        normalized: { x, y },
        drawRectPosition: { x: pageX, y: pageY },
      },
    });
  }

  zoomOut() {
    this.setState({
      zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
    });
  }

  zoomIn() {
    this.setState({
      zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
    });
  }

  setFocusDepth(depth) {
    this.setState({
      depth,
    });
  }

  onBarCodeRead = (e) => {alert("Barcode value is" + e.data, "Barcode type is" + e.type);}

  renderCamera() {
    
    const drawFocusRingPosition = {
      top: this.state.autoFocusPoint.drawRectPosition.y - 152,
      left: this.state.autoFocusPoint.drawRectPosition.x - 32,
    };
    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}
        flashMode={this.state.flash}
        onBarCodeRead={this.onBarCodeRead}
        autoFocus={this.state.autoFocus}
        autoFocusPointOfInterest={this.state.autoFocusPoint.normalized}
        zoom={this.state.zoom}
        focusDepth={this.state.depth}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      >
        <View style={StyleSheet.absoluteFill}>
          <View style={[styles.autoFocusBox, drawFocusRingPosition]} />
          <TouchableWithoutFeedback onPress={this.touchToFocus.bind(this)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
        </View>


        <View style={{ bottom: 0 }}>
          {this.state.zoom !== 0 && (
            <Text style={[styles.flipText, styles.zoomText]}>Zoom: {this.state.zoom}</Text>
          )}
          <View
            style={{
			  height: 56,
			  bottom:0,
              backgroundColor: 'transparent',
              flexDirection: 'row',
              alignSelf: 'flex-end',
            }}
          >
			<TouchableOpacity
              style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
              onPress={this.toggleFlash.bind(this)}
            >
              <Text style={styles.flipText}> Flash </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
              onPress={this.zoomIn.bind(this)}
            >
              <Text style={styles.flipText}> + </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
              onPress={this.zoomOut.bind(this)}
            >
              <Text style={styles.flipText}> - </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNCamera>
    );
  }

  getProduct(value){

    this.setState({loading:true})

    Api.get("/api/v1/getProduct/" + value).then(resp =>{
        this.setState({itemProduct: resp.data})
        this.setState({loading:false})
    })
    .catch(error =>{
        ToastAndroid.show("'"+error+"'", ToastAndroid.SHORT)
    });

  }

  changeList(item){
      this.setState({name_product: item.name, itemHrgPcs:item.pcs_price, itemHrgDz:item.dozen_price, itemHrgPck:item.pack_price, itemHrgBx:item.box_price, })
  }

  totalCalculate(value){
      this.setState({totalCalculate: value})
  }

  renderLoading(){
      if(this.state.loading)
        return <ActivityIndicator />
  }

  render() {
    return (
		<Container>

            <Header hasTabs style={{marginTop:16}}>
                <Left/>
                <Body>
                    <Title>Transaksi</Title>
                </Body>
                <Right />
            </Header>

            <Tabs>

                <Tab heading={ <TabHeading><Text>Tambah Barang</Text></TabHeading>}>
                    
                    {/* <View style={{height:"50%"}}>
				        {this.renderCamera()}
			        </View> */}

                    <Item regular style={{backgroundColor:"#FFF"}}>
                        <Input placeholder='Barcode'
                            onChangeText={(text) => { text.length > 2 ? this.getProduct(text) : null }}
                            keyboardType='numeric'
                        />
                    </Item>

                    <View style={{height:128}}>

                        <Content>

                            {this.renderLoading()}

                            <FlatList
                                extraData={this.state}
                                data={this.state.itemProduct}
                                renderItem = {({item, index}) => (

                                    <TouchableOpacity
                                        onPress={() => this.changeList(item)}
                                    >
                                        <Card transparent>
                                            <CardItem>
                                                <Text>{item.name}</Text>
                                            </CardItem>
                                        </Card>
                                    </TouchableOpacity>

                                )}
                                keyExtractor = {(item, index) => index.toString()}
                            />

                        </Content>
                        
                    </View>

                    <Content>

                        <Separator bordered>
                            <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
                                <View style={{flex:1}}>
                                    <Text>Informasi Produk</Text>
                                </View>
                                <View style={{flex:1}}>
                                    <Text>Total : Rp. {this.state.totalCalculate}</Text>
                                </View>
                            </View>
                        </Separator>

                        <List>
                            <ListItem thumbnail>
                                <Left />
                                <Body>
                                    <Text>{this.state.name_product}</Text>
                                    {/* <Text note numberOfLines={1}>Its time to build a difference . .</Text> */}
                                </Body>
                                <Right>
                                    <Input placeholder='Jumlah'
                                        maxLength={3}
                                        style={{marginBottom:-32}}
                                        onChangeText={(text) => { [this.setState({totalItem:text}), this.totalCalculate(text*this.state.satuan_hrg_product) ] }}
                                        keyboardType='numeric'/>
                                </Right>
                            </ListItem>
                        </List>

                        <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
                            <View style={{flex:1}}>
                                <TouchableOpacity onPress={() => [this.setState({satuan_hrg_product:this.state.itemHrgPcs}), this.totalCalculate(this.state.totalItem * this.state.itemHrgPcs)] }>
                                    <Card
                                        title={null}
                                    >
                                        <Text style={{ marginBottom: 10, alignSelf:"center"}}>
                                            Harga pcs
                                        </Text>
                                        <Text style={{ marginBottom: 10, alignSelf:"center"}}>
                                            Rp. {this.state.itemHrgPcs}
                                        </Text>
                                    </Card>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:1}}>
                                <TouchableOpacity onPress={() => [this.setState({satuan_hrg_product:this.state.itemHrgDz}), this.totalCalculate(this.state.totalItem * this.state.itemHrgDz)] }>
                                    <Card
                                        title={null}
                                    >
                                        <Text style={{ marginBottom: 10, alignSelf:"center" }}>
                                            Harga dus
                                        </Text>
                                        <Text style={{ marginBottom: 10, alignSelf:"center"}}>
                                            Rp. {this.state.itemHrgDz}
                                        </Text>
                                    </Card>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
                            <View style={{flex:1}}>
                                <TouchableOpacity onPress={() => [this.setState({satuan_hrg_product:this.state.itemHrgPck}), this.totalCalculate(this.state.totalItem * this.state.itemHrgPck)] }>
                                    <Card
                                        title={null}
                                    >
                                        <Text style={{ marginBottom: 10, alignSelf:"center"}}>
                                            Harga pack
                                        </Text>
                                        <Text style={{ marginBottom: 10, alignSelf:"center"}}>
                                            Rp. {this.state.itemHrgPck}
                                        </Text>
                                    </Card>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:1}}>
                                <TouchableOpacity onPress={() => [this.setState({satuan_hrg_product:this.state.itemHrgBx}), this.totalCalculate(this.state.totalItem * this.state.itemHrgBx)] }>
                                    <Card
                                        title={null}
                                    >
                                        <Text style={{ marginBottom: 10, alignSelf:"center" }}>
                                            Harga box
                                        </Text>
                                        <Text style={{ marginBottom: 10, alignSelf:"center"}}>
                                            Rp. {this.state.itemHrgBx}
                                        </Text>
                                    </Card>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </Content>

                    <Footer>
                        <FooterTab>
                            <Button full>
                                <Text>Tambahkan</Text>
                            </Button>
                        </FooterTab>
                    </Footer>

                </Tab>

                <Tab heading={ <TabHeading><Text>List</Text></TabHeading>}>
                    
                    <Content>

                        <FlatList
                            data={this.state.listTransaction}
                            renderItem = {({item, index}) => (
                                <List style={{backgroundColor:"red"}}>
                                    <ListItem>
                                        <Text>{item.name}</Text>
                                    </ListItem>
                                </List>
                            )
                            }
                            keyExtractor = {(item, index) => index.toString()}
                        />

                        <Button onPress={() => this.setState({listTransaction: [...this.state.listTransaction, {name:"arman"} ] }) }>
                            <Text>add1</Text>
                        </Button>

                    </Content>

                </Tab>

            </Tabs>

		</Container>
	);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#000',
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoFocusBox: {
    position: 'absolute',
    height: 64,
    width: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    opacity: 0.4,
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  },
  zoomText: {
    position: 'absolute',
    bottom: 70,
    zIndex: 2,
    left: 2,
  },
  picButton: {
    backgroundColor: 'darkseagreen',
  },
  text: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#F00',
    justifyContent: 'center',
  },
  textBlock: {
    color: '#F00',
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});