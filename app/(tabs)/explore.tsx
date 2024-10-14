import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { fetchTodos, updateChecked } from '@/store/reducers/apiReducers';
import ModalAdd from '@/components/ModalAdd';
import ModalEdit from '@/components/ModalEdit';
import ModalDelete from '@/components/ModalDelete';
import BottomSheet from '@/components/BottomSheet';
import { AppDispatch, RootState } from '@/store/store';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';

const List = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [idEdit, setIdEdit] = useState<string>('');
  const [titleEdit, setTitleEdit] = useState<string>('');
  const [checkedItems, setCheckedItems] = useState<{ [id: string]: boolean }>({});
  const [isNewTodoAdded, setIsNewTodoAdded] = useState(false);
  const [filter, setFilter] = useState<{ done: boolean, undone: boolean }>({ done: false, undone: false });
  const [visibleModaldelete, setVisibleModaldelete] = useState<boolean>(false);
  const [visibleModaledit, setVisibleModaledit] = useState<boolean>(false);
  const [visibleModaladd, setVisibleModaladd] = useState<boolean>(false);
  const inputRef = useRef<TextInput>(null);
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector((state: RootState) => state.api.todos);
  const status = useSelector((state: RootState) => state.api.status);
  const error = useSelector((state: RootState) => state.api.error);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    // console.log('handleSheetChanges', index);
  }, []);

  const handleFilterChange = (newFilter: { done: boolean, undone: boolean }) => {
    setFilter(newFilter);
  };

  const modalDelete = (id: string) => {
    setIdEdit(id);
    setVisibleModaldelete(!visibleModaldelete);
  };

  const modalEdit = (id: string, title: string) => {
    setIdEdit(id);
    setTitleEdit(title);
    setVisibleModaledit(!visibleModaledit);
  };

  const modalAdd = () => {
    setVisibleModaladd(!visibleModaladd);
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter.done || filter.undone) {
      if (filter.done && filter.undone) {
        return matchesSearch;
      } else if (filter.done) {
        return matchesSearch && todo.status === 'checked';
      } else {
        return matchesSearch && todo.status === 'unchecked';
      }
    }

    return matchesSearch;
  });

  const toggleCheckbox = (itemId: string) => {
    setCheckedItems(prevState => {
      const newCheckedState = {
        ...prevState,
        [itemId]: !prevState[itemId]
      };
      dispatch(updateChecked({ id: itemId, status: newCheckedState[itemId] ? 'checked' : 'unchecked' }))
      return newCheckedState;
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      {status === 'loading' && <Text>Loading...</Text>}
      {status === 'failed' && <Text>Error: {error}</Text>}
      {status === 'succeeded' && (
        <>
          <ScrollView style={styles.scrollView}>
            <View style={{ flex: 1 }}>
              <View style={{ marginVertical: 10, flexDirection: 'row' }}>
                <View style={{ width: '85%', position: 'relative' }}>
                  <Ionicons style={styles.searchIcon} name="search" size={24} color="#888" />
                  <TextInput
                    ref={inputRef}
                    style={styles.searchInput}
                    placeholder="Search..."
                    placeholderTextColor="#888"
                    keyboardType="web-search"
                    returnKeyType="search"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                      <Ionicons name="close-circle" size={20} color="#888" />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity onPress={handlePresentModalPress} style={styles.filterButton}>
                  <Ionicons name="filter" size={30} color="white" />
                </TouchableOpacity>
              </View>

              {filteredTodos.map((item, i) => (
                <Animatable.View
                  key={i}
                  style={styles.todoContainer}
                  animation={isNewTodoAdded ? "bounce" : ""}
                  iterationCount={1}
                  direction={"alternate"}
                  onAnimationEnd={() => setIsNewTodoAdded(false)}
                >
                  <View style={styles.todoItem}>
                    <View style={styles.todoHeader}>
                      <Checkbox
                        status={item.status == 'checked' ? 'checked' : 'unchecked'}
                        onPress={() => toggleCheckbox(item.id)}
                        color={item.status == 'checked' ? '#00A911' : undefined}
                      />
                      <Text style={styles.todoTitle}>{item.title}</Text>
                      <View style={styles.todoIcons}>
                        <TouchableOpacity onPress={() => modalEdit(item.id, item.title)} style={styles.iconButton}>
                          <FontAwesome5 name="pencil-alt" size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => modalDelete(item.id)} style={styles.iconButton}>
                          <Ionicons name="trash-sharp" size={20} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.todoDate}>
                      <Text style={styles.todoDateText}>{moment(item.createdAt).format('YYYY-MM-DD (HH:mm)')}</Text>
                    </View>
                  </View>
                </Animatable.View>
              ))}

            </View>
          </ScrollView>

          <TouchableOpacity onPress={modalAdd} style={styles.addButton}>
            <Ionicons name="add-sharp" size={24} color="white" />
            <Text style={styles.addButtonText}>Add Todo</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Modal Delete */}
      <ModalDelete idd={idEdit} visible={visibleModaldelete} setVisible={setVisibleModaldelete} />

      {/* Modal Edit */}
      <ModalEdit ide={idEdit} title={titleEdit} visible={visibleModaledit} setVisible={setVisibleModaledit} />

      {/* Modal Add */}
      <ModalAdd visible={visibleModaladd} setVisible={setVisibleModaladd} isNewTodoAdded={isNewTodoAdded} setIsNewTodoAdded={setIsNewTodoAdded} />

      {/* Bottom Sheet */}
      <BottomSheetModalProvider>
        <BottomSheet
          bottomSheetModalRef={bottomSheetModalRef}
          snapPoints={snapPoints}
          handleSheetChanges={handleSheetChanges}
          onFilterChange={handleFilterChange}
        />
      </BottomSheetModalProvider>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020A19',
    paddingBottom: 45,
    paddingTop: 15
  },
  scrollView: {
    padding: 25,
  },
  searchIcon: {
    position: 'absolute',
    zIndex: 1,
    top: 10,
    left: 10,
  },
  searchInput: {
    height: 45,
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  filterButton: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  todoContainer: {
  },
  todoItem: {
    marginBottom: 10,
  },
  todoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#fff',
    paddingVertical: 12,
  },
  todoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
    flex: 1,
  },
  todoIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    paddingHorizontal: 10,
  },
  todoDate: {
    alignItems: 'flex-end',
  },
  todoDateText: {
    color: '#fff',
  },
  doneSection: {
    borderBottomWidth: 1,
    borderColor: '#00A911',
    paddingVertical: 5,
    marginVertical: 10
  },
  doneTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#357AAE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    width: '90%',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  addButtonText: {
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
});

export default List;