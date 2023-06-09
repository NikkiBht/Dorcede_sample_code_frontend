import { color, SearchBar } from '@rneui/base';
import React , { useEffect, useState } from 'react';
import { View ,Text, Pressable, Image, TouchableOpacity,Platform, ScrollView, TouchableWithoutFeedback} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/EvilIcons';
import {COLORS} from '../color';
import { STYLES } from '../style';
import { Calendar } from 'react-native-calendars';
import {useRoute} from '@react-navigation/native';
import { Dimensions } from 'react-native';
import Modal from "react-native-modal";

export default function MainSearchbarTouchable(props) {
  // State variables
  const [modalVisible, setModalVisible] = useState(false); // State variable to control the visibility of the modal
  const [modalVisibleFilter, setModalVisibleFilter] = useState(false); // State variable to control the visibility of the filter modal
  const today = new Date().toISOString().slice(0, 10); // Current date in the format 'YYYY-MM-DD'
  const route = useRoute(); // Get the current route from the navigation stack
  const [text, setText] = useState(''); // State variable to store the search text
  const [minPrice, setMinPrice] = useState(null); // State variable to store the minimum price
  const [maxPrice, setMaxPrice] = useState(null); // State variable to store the maximum price
  const screenHeight = Dimensions.get('window').height; // Height of the device screen
  const modalHeight = Math.floor(screenHeight * 0.5); // Height of the modal (half of the screen height)
  const [outsideTextMin, setOusdieTextMin] = useState(false); // State variable to track if the minimum price text input is outside of the modal
  const [outsideTextMax, setOusdieTextMax] = useState(false); // State variable to track if the maximum price text input is outside of the modal
  const [priceVisible, setPriceVisible] = useState(false); // State variable to control the visibility of the price range section
  const [availabilityVisible, setAvailabilityVisible] = useState(false); // State variable to control the visibility of the availability section
  const [startDate, setStartDate] = useState(null); // State variable to store the start date of the selected date range
  const [endDate, setEndDate] = useState(null); // State variable to store the end date of the selected date range
  const [markedStartDates, setMarkedStartDates] = useState({}); // State variable to store the marked start dates in the calendar
  // Function to handle the submission of the search form
  const handleSubmit = () => {
    props.onSubmit(text);
  }

  // Function to handle the filter button press
  const handleFilter = () => {
    props.onPress(minPrice, maxPrice);
    closeModal();
  }

  // Function to close the filter modal
  const closeModal = () => {
    setModalVisibleFilter(false);
  };

  // Function to handle the selection of a day in the calendar
  const onDayPress = (day) => {
    if (!startDate) {
      setStartDate(day.dateString);
    } else if (!endDate) {
      setEndDate(day.dateString);
    } else {
      setStartDate(day.dateString);
      setEndDate(null);
    }
  }

  // Object to store the marked dates in the calendar
  const markedDates = {};
  if (startDate && endDate) {
    for (let date = new Date(startDate); date <= new Date(endDate); date.setDate(date.getDate() + 1)) {
      markedDates[date.toISOString().slice(0, 10)] = {
        periods: [
          {
            startingDay: date.toISOString().slice(0, 10) === startDate,
            endingDay: date.toISOString().slice(0, 10) === endDate,
            color: 'black'
          }
        ]
      };
    }
  }
  return (
    <View style={styles.searchBarContainer}>
      <Pressable>
        <Icon name='search' size={35} />
      </Pressable>
      
      <TextInput
        returnKeyType="search"
        onSubmitEditing={handleSubmit}
        onChangeText={(text) => setText(text)}
        placeholder='Search'
        style={STYLES.SearchBarTextInput}
      />

      <Pressable
        onPress={() => {
          setModalVisibleFilter(true);
          setMinPrice(null);
          setMaxPrice(null);
          setOutsideTextMin(false);
          setOutsideTextMax(false);
        }}
        style={styles.filterButton}
      >
        <Image
          style={styles.filterIcon}
          source={require('../../assets/Icons/Filter_icon_thinerer.png')}
        />
      </Pressable>

      <Modal
        transparent={true}
        isVisible={modalVisibleFilter}
        swipeDirection="down"
        onSwipeComplete={() => {setModalVisibleFilter(!modalVisibleFilter);}}
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} />

          <View style={styles.contentContainer}>
            <View style={styles.priceRangeContainer}>
              <TouchableOpacity
                onPress={() => {
                  setPriceVisible(!priceVisible);
                  setAvailabilityVisible(false);
                }}
                style={styles.priceRangeButton}
              >
                <Text>Price{(route.name === 'Rent_View_list' || route.name === 'Rent_View_map') ? <Text>/day</Text> : null} Range</Text>
              </TouchableOpacity>

              {priceVisible &&
                <View style={styles.priceRangeInputsContainer}>
                  <View style={styles.priceInputContainer}>
                    {outsideTextMin && <Text style={styles.outsideTextInput}>Min</Text>}
                    <TextInput
                      multiline={false}
                      textAlignVertical='center'
                      onFocus={() => setOutsideTextMin(true)}
                      onBlur={() => minPrice ? setOutsideTextMin(true) : setOutsideTextMin(false)}
                      keyboardType="numeric"
                      placeholder={outsideTextMin ? "" : "Min"}
                      value={minPrice}
                      onChangeText={setMinPrice}
                      style={styles.priceInput}
                    />
                  </View>

                  <View style={styles.priceSeparatorContainer}>
                    <Text style={styles.priceSeparator}>__</Text>
                  </View>

                  <View style={styles.priceInputContainer}>
                    {outsideTextMax && <Text style={styles.outsideTextInput}>Max</Text>}
                    <TextInput
                      multiline={false}
                      textAlignVertical='center'
                      onFocus={() => setOutsideTextMax(true)}
                      onBlur={() => maxPrice ? setOutsideTextMax(true) : setOutsideTextMax(false)}
                      placeholder={outsideTextMax ? "" : "Max"}
                      value={maxPrice}
                      keyboardType="numeric"
                      onChangeText={setMaxPrice}
                      style={styles.priceInput}
                    />
                  </View>
                </View>
              }
            </View>

            {(route.name === 'Rent_View_list' || route.name === 'Rent_View_map' || route.name === 'GarageSale_View_List' || route.name === 'GarageSale_View_Map') &&
              availabilityVisible &&
              <Calendar
                style={styles.calendar}
                minDate={today}
                onDayPress={onDayPress}
                markedDates={
                  startDate && endDate ? markedDates :
                  startDate && !endDate ?
                  {
                    [startDate]: {
                      periods: [
                        {startingDay: true, endingDay: false, color: 'black'},
                      ]
                    }
                  }
                  : startDate === endDate ? 
                  {
                    [startDate]: {
                      periods: [
                        {startingDay: true, endingDay: true, color: 'black'},
                      ]
                    }
                  }
                  :
                  {}
                }
                markingType={'multi-period'}
              />
            }
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={handleFilter}
              style={styles.showButton}
            >
              <Text style={styles.buttonText}>Show</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisibleFilter(!modalVisibleFilter)}
              style={styles.cancelButton}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
export const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    width: '82%',
    borderRadius: 50,
    backgroundColor: COLORS.Searchbar,
    marginBottom: 5,
    alignItems: 'center',
  },
  searchIconContainer: {
    // Add any styles specific to the search icon container
  },
  searchIcon: {
    // Add any styles specific to the search icon
  },
  textInput: {
    // Add any styles specific to the text input
  },
  filterButtonContainer: {
    zIndex: 2,
    backgroundColor: COLORS.FilterColor,
    borderColor: COLORS.Primary,
    borderWidth: 0.09,
    alignSelf: 'flex-start',
    borderRadius: 34.9 / 2,
    position: 'absolute',
    right: 0,
  },
  filterIcon: {
    width: 35,
    height: 35,
  },
});



const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  modalContainer: {
    height: (route.name === 'Buy_View_list' || route.name === 'Buy_View_map') ? modalHeight : '90%',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    position: 'absolute',
    bottom: 0,
  },
  closeButton: {
    backgroundColor: '#555a66',
    width: 50,
    height: 7,
    top: 10,
    margin: 7,
    borderRadius: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    paddingBottom: 100,
  },
  priceRangeContainer: {
    paddingTop: 10,
    alignItems: 'flex-start',
  },
  priceRangeButton: {
    backgroundColor: '#e7e7da',
    padding: 8,
    width: 300,
    borderRadius: 10,
    textAlignVertical: 'center',
  },
  priceRangeInputsContainer: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    paddingTop: 0,
  },
  priceInputContainer: {
    // Add any styles specific to the price input container
  },
  outsideTextInput: {
    position: 'absolute',
    bottom: 60,
    right: 80,
    backgroundColor: 'white',
    zIndex: 1,
    paddingRight: 3,
    paddingLeft: 3,
    color: 'grey',
  },
  priceInput: {
    borderColor: COLORS.Primary,
    borderWidth: 0.2,
    justifyContent: 'space-between',
    textAlign: 'center',
    alignItems: 'center',
    width: 90,
    borderRadius: 10,
    padding: 10,
    margin: 20,
  },
  priceSeparatorContainer: {
    marginTop: 10,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
  },
  priceSeparator: {
    color: COLORS.Primary,
    paddingTop: 10,
  },
  calendar: {
    borderWidth: 1,
    borderColor: COLORS.Border,
    width: 250,
    margin: 10,
  },
  buttonsContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  showButton: {
    borderRadius: 25,
    backgroundColor: COLORS.Primary,
    padding: 15,
    marginRight: 10,
  },
  cancelButton: {
    borderRadius: 25,
    backgroundColor: '#555a66',
    padding: 15,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
