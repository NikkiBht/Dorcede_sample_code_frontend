import React, { useState, useEffect, useContext } from 'react';
import { Text, View, Image, FlatList,StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/native';
import { Context } from '../../components/globalcontext';
import { COLORS } from '../../color';

export default function ProfReview() {
  // State variables
  const [reviewes, setReviewes] = useState(); // Holds the review data
  const [dataIsEmpty, setDataIsEmpty] = useState(false); // Indicates whether the data is empty or not

  // Access the current route
  const route = useRoute();

  // Access the global context
  const globalContext = useContext(Context);
  const { serverUrl } = globalContext;

  // Get the profileId from route parameters
  let profileId = route.params.profileId;

  // Function to fetch review data
  function getReviewData() {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    const url = serverUrl + `comments-and-rating/${profileId}/`;

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data !== 'No comments yet') {
          setReviewes(data);
        } else {
          setDataIsEmpty(true);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    // Fetch review data when the profileId changes
    if (profileId) {
      getReviewData();
    }
  }, [profileId]);

  return (
  <View style={styles.container}>
    {dataIsEmpty ? (
      <Text style={styles.noReviewsText}>No reviews yet</Text>
    ) : (
      <FlatList
        showsVerticalScrollIndicator={false}
        initialNumToRender={1}
        numColumns={1}
        data={reviewes}
        renderItem={({ item }) => (
          <View>
            <View style={styles.reviewerInfoContainer}>
              <Image
                source={{ uri: item.rater.image }}
                style={styles.reviewerImage}
              />
              <Text style={styles.reviewerName}>{item.rater.first_name}</Text>
            </View>
            <View style={styles.ratingContainer}>
              {Array.from({ length: 5 }, (_, index) => (
                <Icon
                  key={index}
                  name={index < item.rating ? "star" : "star-o"}
                  size={20}
                  color={COLORS.Primary}
                  style={styles.ratingStar}
                />
              ))}
              <Text style={styles.reviewTime}>{item.time}</Text>
            </View>
            <View>
              <Text style={styles.comment}>{item.comment}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    )}
  </View>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noReviewsText: {
    paddingBottom: 20,
    paddingTop: 20,
    alignSelf: 'center',
  },
  reviewerInfoContainer: {
    flexDirection: 'row',
  },
  reviewerImage: {
    marginLeft: 20,
    marginTop: 20,
    height: 30,
    width: 30,
    borderRadius: 30/2,
  },
  reviewerName: {
    marginLeft: 20,
    marginTop: 25,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 10,
  },
  ratingStar: {
    marginLeft: 20,
  },
  reviewTime: {
    paddingLeft: 20,
  },
  comment: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});

 
