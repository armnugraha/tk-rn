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
  ActivityIndicator,
  FlatList
} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { RNCamera } from 'react-native-camera';
import { Container, Header, Content, List, ListItem, Button, Tab, Tabs, TabHeading, Left, Body, Right, Title, Item, Input, Footer, FooterTab, Separator, Card, CardItem, Icon } from 'native-base';
import Api from '../../libs/Api';
import moment from 'moment'

const flashModeOrder = {
  off: 'torch',
  torch: 'off',
};

export default class CameraScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
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
            // {name: "I",
            // price: 2000,
            // qty:2,
            // unit:"pcs"}
            listTransaction: [{name: "I",
            price: 2000,
            qty:2,
            unit:"pcs"},{name: "I2",
            price: 2000,
            qty:2,
            unit:"pcs"}],
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
            satuan_unit:"",
    
            // tab 2
            total_harga_keseluruhan:0,
            jumlah_bayar:0,
            jumlah_kembalian:0,
            invoice_code:null,
        };

    }

    componentDidMount(){
        let thn = moment().format("YY")
        let bln = moment().format("MM")
        let hr = moment().format("DD")

        let code = "INV-"+thn+"-"+Math.floor(Math.random() * 100)+"-"+bln+"-"+Math.floor(Math.random() * 10)+"-"+hr
        this.setState({invoice_code:code})
    }

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

        this.setState({name_product: item.name, itemHrgPcs:item.pcs_price, itemHrgDz:item.dozen_price, itemHrgPck:item.pack_price, itemHrgBx:item.box_price, 
            totalCalculate: 0, satuan_unit: null, satuan_hrg_product:0
        })
    }

    totalCalculate(value){
        this.setState({totalCalculate: value})
    }

    storeTransaksi(){

        let params = {
            invoice: this.state.invoice_code,
            items: JSON.stringify(this.state.listTransaction),
            payment: this.state.jumlah_bayar,
            total: this.state.total_harga_keseluruhan,
            kembalian: this.state.jumlah_kembalian,
        };

        return Api.post('/api/v1/create_transaction', params).then(resp =>{
            alert(JSON.stringify(resp))
        })
        .catch(error =>{
            alert(JSON.stringify(error))
        });
    }

    removeListObject(e){
        var array = [...this.state.listTransaction]; // make a separate copy of the array

        array = array.filter( el => el.name !== e )

        this.setState({listTransaction: array});
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
                        
                    </View>

                    <Content>

                        <Separator bordered>
                            <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
                                <View style={{flex:1}}>
                                    <Text>Informasi Produk</Text>
                                </View>
                                <View style={{flex:1}}>
                                    <Text>Total : Rp. {this.state.totalCalculate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ({this.state.satuan_unit})</Text>
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
                                <TouchableOpacity onPress={() => [this.setState({satuan_hrg_product:this.state.itemHrgPcs, satuan_unit:"pcs"}), this.totalCalculate(this.state.totalItem * this.state.itemHrgPcs)] }>
                                    <Card
                                        title={null}
                                    >
                                        <Text style={{ marginBottom: 10, alignSelf:"center"}}>
                                            Harga pcs
                                        </Text>
                                        <Text style={{ marginBottom: 10, alignSelf:"center"}}>
                                            Rp. {this.state.itemHrgPcs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </Text>
                                    </Card>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:1}}>
                                <TouchableOpacity onPress={() => [this.setState({satuan_hrg_product:this.state.itemHrgDz, satuan_unit:"dus"}), this.totalCalculate(this.state.totalItem * this.state.itemHrgDz)] }>
                                    <Card
                                        title={null}
                                    >
                                        <Text style={{ marginBottom: 10, alignSelf:"center" }}>
                                            Harga dus
                                        </Text>
                                        <Text style={{ marginBottom: 10, alignSelf:"center"}}>
                                            Rp. {this.state.itemHrgDz.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </Text>
                                    </Card>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
                            <View style={{flex:1}}>
                                <TouchableOpacity onPress={() => [this.setState({satuan_hrg_product:this.state.itemHrgPck, satuan_unit:"pack"}), this.totalCalculate(this.state.totalItem * this.state.itemHrgPck)] }>
                                    <Card
                                        title={null}
                                    >
                                        <Text style={{ marginBottom: 10, alignSelf:"center"}}>
                                            Harga pack
                                        </Text>
                                        <Text style={{ marginBottom: 10, alignSelf:"center"}}>
                                            Rp. {this.state.itemHrgPck.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </Text>
                                    </Card>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:1}}>
                                <TouchableOpacity onPress={() => [this.setState({satuan_hrg_product:this.state.itemHrgBx, satuan_unit:"box"}), this.totalCalculate(this.state.totalItem * this.state.itemHrgBx)] }>
                                    <Card
                                        title={null}
                                    >
                                        <Text style={{ marginBottom: 10, alignSelf:"center" }}>
                                            Harga box
                                        </Text>
                                        <Text style={{ marginBottom: 10, alignSelf:"center"}}>
                                            Rp. {this.state.itemHrgBx.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </Text>
                                    </Card>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </Content>

                    {this.state.totalCalculate != 0 ?

                        <Footer>
                            <FooterTab>
                                <Button full onPress={() => this.setState({total_harga_keseluruhan: (this.state.total_harga_keseluruhan + this.state.totalCalculate),
                                    totalCalculate: 0, satuan_unit: null, satuan_hrg_product:0,
                                    listTransaction: [...this.state.listTransaction, {name: this.state.name_product, unit: this.state.satuan_unit, price: this.state.satuan_hrg_product, qty: this.state.totalItem, item_discount:0, item_discount_subtotal:0, subtotal:this.state.totalCalculate} ] }) }>
                                    <Text>Tambahkan</Text>
                                </Button>
                            </FooterTab>
                        </Footer>

                    : null
                    }

                </Tab>

                <Tab heading={ <TabHeading><Text>List</Text></TabHeading>}>
                    
                    {/* <Content> */}

                        <FlatList
                            data={this.state.listTransaction}
                            renderItem = {({item, index}) => (
                                <List>
                                    <ListItem>
                                        <Body>
                                            <Text>{item.name} (Rp. {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})</Text>
                                            <Text note numberOfLines={1}>{item.qty} ({item.unit})</Text>
                                        </Body>
                                        <Right>
                                            <Button style={{ backgroundColor: "#c70d3a" }} onPress={() => this.removeListObject(item.name)}>
                                                <Icon active name="trash" />
                                            </Button>
                                        </Right>
                                    </ListItem>
                                </List>
                            )
                            }
                            keyExtractor = {(item, index) => index.toString()}
                        />

                        <List>

                            <Separator bordered>
                                <View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
                                    <View style={{flex:1}}>
                                        <Text>Informasi Transaksi</Text>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text>Invoice {this.state.invoice_code}</Text>
                                    </View>
                                </View>
                            </Separator>

                            <ListItem thumbnail>
                                <Left />
                                <Body>
                                    <Text>Total</Text>
                                </Body>
                                <Right>
                                    <Text>Rp. {this.state.total_harga_keseluruhan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                </Right>
                            </ListItem>
                            <ListItem thumbnail>
                                <Left />
                                <Body>
                                    <Text>Pembayaran</Text>
                                </Body>
                                <Right>
                                    <Input placeholder='Jumlah'
                                        style={{marginBottom:-32}}
                                        onChangeText={(text) => { [this.setState({jumlah_bayar:text, jumlah_kembalian:this.state.total_harga_keseluruhan - text }) ] }}
                                        keyboardType='numeric'/>
                                </Right>
                            </ListItem>
                            <ListItem thumbnail>
                                <Left />
                                <Body>
                                    <Text>Kembalian</Text>
                                </Body>
                                <Right>
                                    <Text>Rp. {this.state.jumlah_kembalian.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                </Right>
                            </ListItem>
                        </List>

                        <Button full onPress={() => this.storeTransaksi() }>
                            <Text>Tambah</Text>
                        </Button>

                    {/* </Content> */}

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