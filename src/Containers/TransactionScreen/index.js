/* eslint-disable no-console */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { RNCamera } from 'react-native-camera';
import { Container, Header, Content, List, ListItem, Button, Tab, Tabs, TabHeading, Left, Body, Right, Title, Item, Input } from 'native-base';
import { FlatList } from 'react-native-gesture-handler';

const flashModeOrder = {
  off: 'torch',
  torch: 'off',
};

const landmarkSize = 2;

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

  render() {
    return (
		<Container>

            <Header hasTabs>
                <Left/>
                <Body>
                    <Title>Transaksi</Title>
                </Body>
                <Right />
            </Header>

            <Tabs>

                <Tab heading={ <TabHeading><Text>Tambah Barang</Text></TabHeading>}>
                    
                    <View style={{height:"50%"}}>
				        {this.renderCamera()}
			        </View>

                    <Item regular style={{backgroundColor:"#FFF"}}>
                        <Input placeholder='Rounded Textbox'/>
                    </Item>
                    <Content>

                    </Content>

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