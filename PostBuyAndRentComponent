import React, { useState, useEffect, useContext } from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
  ImageStore,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import IcOn from 'react-native-vector-icons/Ionicons';
import ICON from 'react-native-vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/native';
import { COLORS } from '../color';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Context } from './globalcontext';

// Component for displaying posts for buying and renting
const PostBuyAndRentComponent = (props) => {
  // State variables
  const [active, setState] = useState(0); // Currently active slide index
  const [PostpicData, SetPostpicData] = useState(''); // Post picture data
  const [initialIsLiked, setInitialIsLiked] = useState(false); // Initial like status
  const [isLiked, setIsLiked] = useState(initialIsLiked); // Current like status
  const [likeDataIsFetched, setLikeDataIsFetched] = useState(false); // Flag to indicate if like data has been fetched
  const [initialIsDeleted, setInitialIsDeleted] = useState(false); // Initial delete status
  const [isDeleted, setIsDeleted] = useState(initialIsDeleted); // Current delete status

  const route = useRoute(); // Access the route object
  const post = props.post; // Get the post object
  const isFocused = props.isFocused; // Indicate if the screen is currently focused

  const globalContext = useContext(Context); // Access the global context
  const { serverUrl, profileObject, token } = globalContext; // Destructure values from the global context

  const { width } = Dimensions.get('window'); // Get the window width
  let Width = route.name === 'Fav' ? width * 0.4 : width * 0.44; // Calculate the width based on the route name
  const id = post && post.id; // Get the post ID

  // Variables for API endpoints based on post type
  let createLikes;
  let deleteLikes;
  let createDeletes;
  let postPicture;
  let getLikedPostsPerUserPerPost;

  // Modify the time format if it includes 'days' and 'hours'
  if (typeof post != 'string') {
    if (post.time.includes('days') && post.time.includes('hours')) {
      post.time = post.time.slice(0, 6).concat(' ago');
    }
  }

  // Set API endpoints based on post type
  if (post.post_type === 'Rent') {
    createLikes = 'rent-post-likes-create/';
    deleteLikes = 'rent-post-likes-delete/';
    createDeletes = 'rent-post-deletes-create/';
    postPicture = 'rent-post-pictures/';
    getLikedPostsPerUserPerPost = 'get-rent-liked-posts-per-user-per-post/';
  } else if (post.post_type === 'Sell') {
    createLikes = 'post-likes-create/';
    deleteLikes = 'post-likes-delete/';
    createDeletes = 'post-deletes-create/';
    postPicture = 'post-pictures';
    getLikedPostsPerUserPerPost = 'GetLikedPostsPerUserPerPost/';
  }

  // Array to store post images
  const PostImages = new Array();
  for (let ImageUri in PostpicData) {
    PostImages.push({ uri: PostpicData[ImageUri]['image'] });
  }

  const navigation = useNavigation(); // Access the navigation object

  // Function to handle slide change
  const change = ({ nativeEvent }) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
    );

    if (slide !== active) {
      setState(slide);
    }
  };

  // Function to handle like
  function handleLike() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: profileObject['id'],
        post: post.id,
      }),
    };

    const url = serverUrl + createLikes;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then(() => {
        setIsLiked(!isLiked);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  // Function to handle unlike
  function handleUnlike() {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const urlUnlike = `${serverUrl}${deleteLikes}${post.id}/${profileObject['id']}`;
    fetch(urlUnlike, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error deleting like');
        }
      })
      .then((data) => {
        setIsLiked(!isLiked);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  // Function to handle delete
  function handleDelete() {
    const requestOptionsHandleDelete = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const urlDeleteLike = `${serverUrl}${deleteLikes}${post.id}/${profileObject['id']}`;
    fetch(urlDeleteLike, requestOptionsHandleDelete)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error deleting like');
        }
      })
      .then((data) => {
        setIsLiked(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    const requestOptionsCreateDeletes = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: profileObject['id'],
        post: post.id,
      }),
    };

    const url = serverUrl + createDeletes;
    fetch(url, requestOptionsCreateDeletes)
      .then((response) => response.json())
      .then(() => {
        setIsDeleted(!isDeleted);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  // Function to fetch post picture data
  function fetchPostpicture() {
    const requestOptions = {
      method: 'GET',
    };

    const url = `${serverUrl}${postPicture}?post_id=${id}`;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        SetPostpicData(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  // Function to fetch liked post data
  function fetchLikedPostdata() {
    const requestOptions = {
      method: 'GET',
    };
    const url = `${serverUrl}${getLikedPostsPerUserPerPost}?userId=${profileObject['id']}&postId=${id}`;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setInitialIsLiked(true);
        } else {
          setInitialIsLiked(false);
        }
        setLikeDataIsFetched(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  // Fetch post picture and liked post data on component mount
  useEffect(() => {
    fetchPostpicture();
    if (profileObject) {
      fetchLikedPostdata();
      setIsLiked(initialIsLiked);
      setIsDeleted(initialIsDeleted);
    }
  }, [initialIsLiked, isFocused, initialIsDeleted]);

 return (
    <View style={styles.container}>
      {!isDeleted && (
        <View style={[styles.postContainer, route.name === 'Rent_View_list' && { borderColor: COLORS.PrimePurple }]}>
          <Pressable
            activeOpacity={100}
            onPress={() => {
              if (post.post_type === 'Rent') {
                return navigation.navigate('RentShowPost', { PostId: id, navigateFrom: route.name });
              } else if (post.post_type === 'Sell') {
                return navigation.navigate('BuyPost', { PostId: id, navigateFrom: route.name });
              }
            }}
          >
            <View style={styles.imageContainer}>
              <ScrollView
                pagingEnabled
                horizontal
                onScroll={change}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                style={styles.imageScrollView}
              >
                <Image source={PostImages[0]} style={styles.postImage} />
              </ScrollView>
              <View style={styles.actionButtonsContainer}>
                {profileObject != false && !isDeleted && (
                  <Pressable onPress={handleDelete} style={styles.actionButton}>
                    <Icon name="close" size={35} color="#a8a897" />
                  </Pressable>
                )}
                {profileObject != false && (
                  <Pressable onPress={() => (isLiked ? handleUnlike() : handleLike())} style={styles.actionButton}>
                    <Icon name="heart" size={30} color={isLiked ? 'red' : '#a8a897'} />
                  </Pressable>
                )}
              </View>
            </View>

            <View style={styles.postDetailsContainer}>
              <Text numberOfLines={2} style={styles.postTitle}>
                {post.title}
              </Text>
              <Text numberOfLines={1} style={styles.postPrice}>
                ${post.price}
                {post.price_unit && <Text style={styles.priceUnit}>/{post.price_unit}</Text>}
              </Text>
              {post.post_type === 'Rent' && (
                <View style={styles.ratingContainer}>
                  <Icon name="star-o" size={12} color="black" style={styles.ratingIcon} />
                  <Text numberOfLines={1} style={styles.averageRating}>
                    {post.average_rating ? <Text>{post.average_rating}</Text> : <Text>No Rating</Text>}
                  </Text>
                </View>
              )}
              {post.post_type !== 'Rent' && (
                <Text numberOfLines={1} style={styles.postTime}>
                  {post.time}
                </Text>
              )}
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default PostBuyAndRentComponent;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 15,
    marginRight: 8,
    marginLeft: 8,
  },
  postContainer: {
    borderWidth: 0,
    borderRadius: 15,
  },
  imageContainer: {
    backgroundColor: 'white',
    width: Width,
    borderRadius: 15,
    paddingBottom: 5,
  },
  imageScrollView: {
    width: Width,
    aspectRatio: 3 / 4,
    borderTopLeftRadius: 25,
  },
  postImage: {
    width: Width,
    aspectRatio: 3 / 4,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -5,
  },
  actionButton: {
    alignSelf: 'center',
  },
  postDetailsContainer: {
    flexDirection: 'column',
  },
  postTitle: {
    marginLeft: 15,
    marginTop: 15,
    fontSize: 15,
    lineHeight: 17,
  },
  postPrice: {
    marginLeft: 15,
    marginTop: 3,
    alignSelf: 'flex-start',
    fontSize: 14,
    alignItems: 'center',
    borderRadius: 5,
  },
  priceUnit: {
    fontSize: 13,
  },
  ratingContainer: {
    marginTop: 0,
    marginLeft: 13,
    padding: 4,
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  ratingIcon: {
    alignSelf: 'center',
    paddingTop: 2,
  },
  averageRating: {
    fontSize: 13,
    paddingLeft: 5,
  },
  postTime: {
    alignSelf: 'flex-start',
    padding: 4,
    borderRadius: 5,
    marginLeft: 13,
    marginTop: 0,
    fontSize: 12,
  },
