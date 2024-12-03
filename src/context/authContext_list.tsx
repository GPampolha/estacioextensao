import React, { createContext, useContext, useEffect, useRef, useState } from "react"; 
import { themas } from "../global/themes";
import { Flag } from "../components/Flag";
import { Input } from "../components/Input";
import { Modalize } from 'react-native-modalize';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomDateTimePicker from "../components/CustomDateTimePicker";
import { TouchableOpacity, Text, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Loading } from "../components/Loading";


export const AuthContextList:any= createContext({});

const flags = [
    { caption: 'INSUFICIENTE', color: themas.Colors.red },
    { caption: 'SUFICIENTE', color: themas.Colors.gray },
    { caption: 'EXCEDENTE', color: themas.Colors.blueLigth }
];

export const AuthProviderList = (props) => {
    const modalizeRef = useRef(null);
    const [title, setTitle] = useState('');
    const [size, setSize] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [selectedFlag, setSelectedFlag] = useState('SUFICIENTE');
    const [taskList, setTaskList] = useState([]);
    const [taskListBackup,setTaskListBackup]= useState([]);
    const [item,setItem] = useState(0);
    const [loading,setLoading]= useState(false)

    const onOpen = () => {
        modalizeRef.current?.open();
    };

    const onClose = () => {
        modalizeRef.current?.close();
    };

    useEffect(() => {
        get_taskList();
    }, []);

    const handleSave = async () => {
        const newItem = {
            item: item !== 0 ? item : Date.now(),
            title,
            quantity,
            size,
            category,
            flag: selectedFlag,
        };
        onClose();
    
        try {
            setLoading(true)
            const storedData = await AsyncStorage.getItem('taskList');
            let taskList = storedData ? JSON.parse(storedData) : [];
    
            // Verifica se o item já existe no array
            const itemIndex = taskList.findIndex((task) => task.item === newItem.item);
    
            if (itemIndex >= 0) {
                // Substitui o item existente pelo novo
                taskList[itemIndex] = newItem;
            } else {
                // Adiciona o novo item ao array
                taskList.push(newItem);
            }
    
            await AsyncStorage.setItem('taskList', JSON.stringify(taskList));
            setTaskList(taskList);
            setTaskListBackup(taskList)
            setData()
            
        } catch (error) {
            console.error("Erro ao salvar o item:", error);
            onOpen()
        }finally{
            setLoading(false)
        }
    };
    
    const filter = (t:string) => {
        if(taskList.length == 0)return
        const array = taskListBackup
        const campos = ['title','quantity', 'size', 'category']
        if (t) {
            const searchTerm = t.trim().toLowerCase(); 
            
            const filteredArr = array.filter((item) =>{ 
                for(let i =0; i<campos.length; i++){
                    if(item[campos[i].trim()].trim().toLowerCase().includes(searchTerm))
                        return true
                }
            });
    
            setTaskList(filteredArr);
        } else {
            setTaskList(array);
        }
    }

    

    const handleEdit = async (itemToEdit:PropCard) => {
        setTitle(itemToEdit.title);
        setQuantity(itemToEdit.quantity);
        setSelectedFlag(itemToEdit.flag);
        setItem(itemToEdit.item);
        setCategory(itemToEdit.category);
        setSize(itemToEdit.size)
        
        onOpen(); 
    };
    
    const handleDelete = async (itemToDelete) => {
        try {
            setLoading(true)
            const storedData = await AsyncStorage.getItem('taskList');
            const taskList = storedData ? JSON.parse(storedData) : [];
            
            const updatedTaskList = taskList.filter(item => item.item !== itemToDelete.item);
    
            await AsyncStorage.setItem('taskList', JSON.stringify(updatedTaskList));
            setTaskList(updatedTaskList);
            setTaskListBackup(updatedTaskList)
        } catch (error) {
            console.error("Erro ao excluir o item:", error);
        }finally{
            setLoading(false)
        }
    };
    

    async function get_taskList() {
        try {
            setLoading(true)
            const storedData = await AsyncStorage.getItem('taskList');
            const taskList = storedData ? JSON.parse(storedData) : [];
            setTaskList(taskList);
            setTaskListBackup(taskList)
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false)
        }
    }

    const _renderFlags = () => {
        return flags.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => {
                setSelectedFlag(item.caption)
            }}>
                <Flag 
                    caption={item.caption}
                    color={item.color} 
                    selected={item.caption == selectedFlag}
                />
            </TouchableOpacity>
        ));
    };

    const setData = ()=>{
        setTitle('');
        setQuantity('');
        setCategory('');
        setSize('');
        setSelectedFlag('SUFICIENTE');
        setItem(0)
    }

    const _container = () => {
        return (
            <KeyboardAvoidingView 
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => onClose()}>
                            <MaterialIcons name="close" size={30} />
                        </TouchableOpacity>
                        <Text style={styles.title}>{item != 0?'Editar peça':'Adicionar peça'}</Text>
                        <TouchableOpacity onPress={handleSave}>
                            <AntDesign name="check" size={30} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>

                            <Input 
                            title="Nome:" 
                            labelStyle={styles.label} 
                            value={title}
                            onChangeText={setTitle}
                            />
                            
                    </View>

                    <View style={styles.content2}>   
                           
                            <Input 
                            title="Categoria:" 
                            labelStyle={styles.label} 
                            value={category}
                            onChangeText={setCategory}
                            />

                    </View>

                    <View style={{ flexDirection: 'row', gap: 13, marginTop: 10, width: 110, paddingHorizontal: 20 }}>         
                            <Input 
                            title="Tamanho:" 
                            labelStyle={styles.label} 
                            value={size}
                            onChangeText={setSize}
                            />

                            <Input 
                            title="Quantidade:" 
                            labelStyle={styles.label} 
                            value={quantity}
                            onChangeText={setQuantity}
                            />

                    </View> 

                    <View style={{ flexDirection: 'row', gap: 16, marginTop: 10, padding: 27 }}>
                        
                        <Text style={styles.flag}>Situação:</Text>
                    
                        {_renderFlags()}
                                
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        );
    };

    return (
        <AuthContextList.Provider value={{ onOpen, taskList,handleEdit,handleDelete,taskListBackup,filter}}>
            <Loading loading={loading}/>
            {props.children}
            <Modalize ref={modalizeRef} childrenStyle={{ height: 400 }} adjustToContentHeight={true}>
                {_container()}
            </Modalize>
        </AuthContextList.Provider>
    );
};

export const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    header: {
        width: '100%',
        height: 40,
        paddingHorizontal: 40,
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    content: {
        width: '80%',
        paddingHorizontal: 20,
        flexDirection: 'row',
        gap: 30
    },
    content2: {
        width: '50%',
        paddingHorizontal: 20,
        flexDirection: 'row',
        gap: 10
    },
    label: {
        fontWeight: 'bold',
        color: '#000'
    },
    containerFlag: {
        width: '100%',
        padding: 30
    },
    flag: {
        fontSize: 14,
        fontWeight: 'bold'
    }
});


export const useAuth = () => useContext(AuthContextList);

