import React, { useEffect, useState } from "react";
import shorthand from "react-native-styles-shorthand";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions} from "react-native";
import api from "./services/api";


const renderSeparator = () => {
  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: "#666",
        height: 0,
        width: Dimensions.get('window').width - 16,
        marginLeft: 6,
        backgroundColor: "white",
      }}
    />
  );
}

export default function App() {

  const [ projects, setProjects ] = useState([]);
  const [ modalVisible ] = useState(false);
  const [ isRefreshing, updateRefreshing ] = useState(false);

  useEffect(() => {
    api.get('/repositories').then(response => setProjects(response.data));
  }, []);

  async function handleLikeRepository(id) {
    const response = await api.post(`/repositories/${id}/like`);
    const project = response.data;
    setProjects(projects.map(o => (o.id == id) ? project:o));
  }

  function handleRefresh() {
    updateRefreshing(true);
    api.get('/repositories').then(response => {
      setProjects(response.data);
      updateRefreshing(false);
    })
    .catch(err => {console.log(err)});
  }

  console.log(styles);
  
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={projects}
          onRefresh={() => handleRefresh()}
          refreshing={isRefreshing}
          renderItem = {(o) => {
            const project = o.item;
            const techs = project.techs;
            return (  
              <View style={styles.repoContainer}>
                <Text style={styles.repository}>{project.title}</Text>
                <View style={styles.techGroup}
                >
                  {
                    techs.map((tech,index)  => 
                      (<Text style={styles.tech} key={index}>{tech}</Text>))
                  }
                </View>

                <View style={styles.likesContainer}>
                  <Text
                    style={styles.likeText}
                    testID={`repository-likes-${project.id}`}
                  >
                    {project.likes} curtida{project.likes != 1 ? 's': ''}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(project.id)}
                  testID={`like-button-${project.id}`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>

                <Modal
                  visible={modalVisible}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>Hello Modal!</Text>
                    </View>
                  </View>    
                </Modal>
              </View>
            )
          }}
          ItemSeparatorComponent={renderSeparator}
          keyExtractor={project => project.id.toString()}
        />

        <TouchableOpacity
          style={styles.button}
        >
          <Text style={styles.addButtonText} onpress={() => toggleModalVisibility(!modalVisible)}>Adicionar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const modifiedStyle = shorthand({
  container: {
    flex: 1,
    margin: 2
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: 'red'
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  repository: {
    justifyContent: 'center',
    fontSize: 32,
    fontWeight: "bold",
    paddingLeft: 10
  },
  repoContainer: {
    borderRadius: 5,
    margin: 6,
    backgroundColor: "#1BCDE0"
  },
  techGroup: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  tech: {
    fontSize: 16,
    margin: "6 10",
    backgroundColor: "#FF8D38",
    padding: "5 10",
    color: "black",
    borderRadius: 6,
  },
  likesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10
  },
  likeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    padding: 15
  },
  addButtonText: {
    fontSize: 20,
    color: 'dimgray',
    border: '2 dotted darksalmon',
    backgroundColor: 'antiquewhite',
    marginBottom: 8,
    paddingLeft: 6,
  }
});

console.log(modifiedStyle);

const styles = StyleSheet.create(modifiedStyle)