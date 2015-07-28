'use strict';

var React = require('react-native');

var {
  AsyncStorage,
  AppRegistry,
  StyleSheet,
  ListView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView
} = React;

var ToDo = React.createClass({
  getInitialState () {
    var itemsDS = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var items = [];
    this.getStorage().then((items) => this.setItems(items));
    return {
      items,
      itemsDS: itemsDS.cloneWithRows(items),
      text: ''
    };
  },
  onChange (event) {
    this.setState({text: event.nativeEvent.text});
  },
  onPress () {
    if (this.state.text) {
      this.state.items.push(this.state.text);
      this.setItems(this.state.items);
      this.setState({text: ''});
      this.updateStorage();
    }
  },
  getStorage () {
    return AsyncStorage
      .getItem('items')
      .then((items) => JSON.parse(items));
  },
  updateStorage () {
    return AsyncStorage.setItem('items', JSON.stringify(this.state.items));
  },
  setItems (items) {
    var itemsDS = this.state.itemsDS.cloneWithRows(items);
    this.setState({items, itemsDS});
  },
  render () {
    return (
      <ScrollView>
        <ListView
          style={styles.list}
          dataSource={this.state.itemsDS}
          renderRow={(rowData) => <Text>{rowData}</Text>}
        />
        <TextInput
          style={styles.input}
          onChange={this.onChange}
          value={this.state.text}
        />
        <TouchableWithoutFeedback onPress={this.onPress}>
          <Text style={styles.submit}>Add entry</Text>
        </TouchableWithoutFeedback>
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  list: {
    flex: 1,
    paddingBottom: 25,
    paddingRight: 25,
    paddingLeft: 25,
    marginBottom: 10,
    backgroundColor: '#F5FCFF'
  },
  input: {
    flex: 1,
    height: 25,
    marginRight: 20,
    marginLeft: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 20
  },
  submit: {
    flex: 1,
    alignSelf: 'center',
    margin: 20,
    padding: 5,
    backgroundColor: '#333333',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 20
  },
});

AppRegistry.registerComponent('todo', () => ToDo);
