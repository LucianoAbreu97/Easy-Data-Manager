import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import NewTableScreen from './screens/NewTableScreen'
import ProfileEditScreen from './screens/ProfileEditScreen'
import TableScreen from './screens/TableScreen'
import AddColumnModal from './components/AddColumnModal'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={LoginScreen} options={{headerShown: false}}/>
        <Stack.Screen name='Register' component={RegisterScreen} options={{headerShown: false}}/>
        <Stack.Screen name='Home' component={HomeScreen} options={{headerShown: false}}/>
        <Stack.Screen name='NewTable' component={NewTableScreen} options={{headerShown: false}}/>
        <Stack.Screen name='ProfileEdit' component={ProfileEditScreen} options={{headerShown: false}}/>
        <Stack.Screen name='Table' component={TableScreen} options={{headerShown: false}}/>
        <Stack.Screen name='AddColumn' component={AddColumnModal} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}                        

