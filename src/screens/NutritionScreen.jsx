import {Divider} from '@rneui/base';
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// Sample data for nutritional information and educative tools
const nutritionalInformation = [
  {
    title: 'Healthy Eating Guide',
    description:
      'Discover the principles of a balanced diet and how to make healthy food choices.',
  },
  {
    title: 'Nutrient-Rich Foods',
    description:
      'Learn about foods rich in essential nutrients and their benefits for overall health.',
  },
  {
    title: 'Portion Control Tips',
    description:
      'Understand the importance of portion control and strategies to manage portion sizes.',
  },
  {
    title: 'Reading Food Labels',
    description:
      'Get tips on how to read food labels to make informed decisions about packaged foods.',
  },
];

const educativeTools = [
  {
    title: 'Video: The Importance of Nutrition',
    url: 'https://example.com/nutrition-video',
  },
  {
    title: 'Article: 10 Healthy Eating Habits',
    url: 'https://example.com/healthy-eating-habits-article',
  },
  {
    title: 'Infographic: Food Pyramid',
    url: 'https://example.com/food-pyramid-infographic',
  },
];

const NutritionScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Nutritional Information</Text>
      <Text style={styles.sectionHeading}>Educative Tools</Text>

      {/* Render educative tools */}
      {educativeTools.map((tool, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => console.log('Tool pressed:', tool.url)}>
          <Text style={styles.link}>{tool.title}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionHeading}>Nutritional Information</Text>

      {/* Render nutritional information */}
      {nutritionalInformation.map((info, index) => (
        <View key={index} style={styles.infoContainer}>
          <Text style={styles.infoTitle}>{info.title}</Text>
          <Text>{info.description}</Text>
          <Divider></Divider>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#1ff80',
    padding: 5,
  },
  link: {
    fontSize: 16,
    marginBottom: 10,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default NutritionScreen;
