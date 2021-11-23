import React, {useState, useEffect} from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, FlatList } from 'react-native';
import* as SQLite from 'expo-sqlite';

export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [groceries, setGroceries ] = useState([]);

  const db  = SQLite.openDatabase('grocery.db');

  useEffect(()=> {
    db .transaction(tx  => {
      tx.executeSql('create table if not exists grocery(id integer primary key not null,product text,amount text);');
    },null,updateList);
    }, []);


    const saveProduct = () => {
      db.transaction(tx => {
        tx.executeSql('insert into grocery(product,amount) values(?,?);',[product, amount]);
      }, null, updateList)}

      const updateList = () =>{
        db.  transaction(tx => {
          tx .executeSql('select* from grocery;', [], (_, { rows}) => 
          setGroceries(rows._array)); });}

      const deleteProduct = (id) => {
          db.transaction(
            tx => {
              tx.executeSql(`delete from grocery where id = ?;`, [id]);}, null, updateList)
            } 

  return (
    <View style={styles.container}>

      <Text style={styles.title}> Shopping list </Text>

      <TextInput
       style={styles.input}
      placeholder="Type product"
      onChangeText={product => setProduct(product)}
      value={product}
      ></TextInput>

      <TextInput
      style={styles.input}
      placeholder="Type amount"
      onChangeText={amount => setAmount(amount)}
      value={amount}
      ></TextInput>

      <Pressable
      style={styles.btnContainer}
      onPress={saveProduct}>
      <Text
      style={styles.btn}>Save</Text>
     </Pressable>

     <FlatList style={{marginLeft: "5%"}}
     keyExtractor={item=> item.id.toString()}
     data={groceries}
     renderItem={({ item})  =>
     <View style={styles.fView}>
       <Text style={styles.text1}>{item.product}, {item.amount} </Text>
       <Text style={styles.text2} onPress={()  =>  deleteProduct(item.id)  }>bought</Text>
    </View>}/>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 70,
  },

  btnContainer:{
    alignItems:'center',
    justifyContent:'center',
    marginTop: 5,
    marginBottom: 5,
  },

  btn:{
    color: 'white',
    width: 300,
    backgroundColor: '#70B8FF',
    textAlign:'center',
    height: 50,
    borderRadius: 20,
    padding: 10,
    fontSize: 18,
  },

  input:{
    width: "90%",
    textAlign:'center',
    backgroundColor: '#f4f4f4',
    height: 50,
    margin: 10,
    borderRadius: 20,
  },

  fView:{
    display:'flex',
    flexDirection: 'row',
    margin: 5,
    marginTop: 15,
  },

  title:{
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },

  text1:{
    color: 'black'
  },

  text2:{
    color: 'blue',
  }

  

});
