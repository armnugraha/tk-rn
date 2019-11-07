import { Dimensions } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from '@react-navigation/native';
const { width, height } = Dimensions.get("window");

import FirstScreen from "../Containers/MainScreen/MainScreen";

/* Antiqueruby Screens List START */

//main screens
import AppScan from "../../AppScan";

// main stack
const MainStack = createStackNavigator(
  {
    FirstScreen: { screen: FirstScreen },
    AppScan: { screen: AppScan }
  },
  {
    headerMode: "none",
    navigationOptions: {
      gesturesEnabled: false
    }
  }
);

const PrimaryNav = createStackNavigator(
  {
    mainStack: { screen: MainStack }
  },
  {
    headerMode: "none",
    initialRouteName: "mainStack",
    gesturesEnabled: false
  }
);

const App = createAppContainer(PrimaryNav);

// export default PrimaryNav;
export default App;

// export default class AppNavigator extends React.Component {
//   render () {
//     return <App />
//   }
// }