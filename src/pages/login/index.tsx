import React,{ useState } from "react";
import { style } from "./styles";
import Logo from '../../assets/logo.png'
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import {Text, View,Image, Alert} from 'react-native'
import { useNavigation,NavigationProp  } from '@react-navigation/native';
import {MaterialIcons,Octicons} from '@expo/vector-icons';

export default function Login (){
    const navigation = useNavigation<NavigationProp<any>>();

    const [email,setEmail]               = useState('ateliedabeca@outlook.com');
    const [password,setPassword]         = useState('beca0305');
    const [showPassword,setShowPassword] = useState(true);
    const [loading,setLoading]           = useState(false);


    async function getLogin() {
        try {
            setLoading(true)
            
            if(!email ||!password){
                return Alert.alert('Anteção','Informe os campos obrigatórios!')
            }

            if(email === 'ateliedabeca@outlook.com' && password === 'beca0305'){
                return navigation.reset({routes:[{name :'BottomRoutes'}]});
            }

            Alert.alert('Atenção','E-mail ou senha invalida!')
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }


    return(
        <View style={style.container}>
            <View style={style.boxTop}>
                <Image 
                    source={Logo} 
                    style={style.logo}
                    resizeMode="contain"
                />
                <Text style={style.text}>Controle de estoque</Text>
            </View>
            <View style={style.boxMid}>
                <Input 
                    title="ENDEREÇO E-MAIL"
                    value={email}
                    onChangeText={setEmail}
                    IconRigth={MaterialIcons}
                    iconRightName="email"
                    onIconRigthPress={()=>console.log('OLA')}
                />
                <Input 
                    title="SENHA"
                    value={password}
                    onChangeText={setPassword}
                    IconRigth={Octicons}
                    iconRightName={showPassword?"eye-closed":"eye"}
                    onIconRigthPress={()=>setShowPassword(!showPassword)}
                    secureTextEntry={true}
                    multiline={false}
                />
            </View>
            <View style={style.boxBottom}>
                <Button  text="ENTRAR" loading={loading} onPress={()=>getLogin()}/>
            </View>
            <Text style={style.textBottom}>Somente para usuários cadastrados. </Text>
        </View>
    )
}