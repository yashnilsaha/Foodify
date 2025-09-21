import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Home from './pages/Home';
import FoodScanner from './pages/FoodScanner';
import Breakdown from './pages/Breakdown'
import History from './pages/History';
import Help from './pages/Help';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
        <Stack.Screen name="FoodScanner" component={FoodScanner} options={{headerShown: false}}/>
        <Stack.Screen name="Breakdown" component={Breakdown} options={{headerShown: false}}/>
        <Stack.Screen name="History" component={History} options={{headerShown: false}}/>
        <Stack.Screen name="Help" component={Help} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
