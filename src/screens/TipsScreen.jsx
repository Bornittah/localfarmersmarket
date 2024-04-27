import * as React from 'react';
import {
  View,
  useWindowDimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';

const Tutorials = () => {
  const tutorialLinks = [
    {
      title: 'Introduction to Farming',
      url: 'https://example.com/introduction',
    },
    {
      title: 'Crop Rotation Techniques',
      url: 'https://example.com/crop-rotation',
    },
    {
      title: 'Soil Preparation Guide',
      url: 'https://example.com/soil-preparation',
    },
    {title: 'Pest Control Methods', url: 'https://example.com/pest-control'},
    {title: 'Harvesting Tips', url: 'https://example.com/harvesting-tips'},
    {
      title: 'Post-Harvest Handling',
      url: 'https://example.com/post-harvest-handling',
    },
  ];
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Farming Tips</Text>
      {tutorialLinks.map((link, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => console.log('Link pressed:', link.url)}>
          <Text style={styles.link}>{link.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const HealthTips = () => {
  const tips = [
    {
      title: 'Benefits of Regular Exercise',
      url: 'https://example.com/exercise-benefits',
    },
    {
      title: 'Healthy Eating Habits',
      url: 'https://example.com/healthy-eating-habits',
    },
    {
      title: 'Importance of Hydration',
      url: 'https://example.com/importance-of-hydration',
    },
    {
      title: 'Stress Management Techniques',
      url: 'https://example.com/stress-management',
    },
    {
      title: 'Getting Enough Sleep',
      url: 'https://example.com/getting-enough-sleep',
    },
    {
      title: 'Mental Health Awareness',
      url: 'https://example.com/mental-health-awareness',
    },
  ];
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Health</Text>
      {tips.map((link, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => console.log('Link pressed:', link.url)}>
          <Text style={styles.link}>{link.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const renderScene = SceneMap({
  first: Tutorials,
  second: HealthTips,
});

function TipsScreen() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Farming Tips'},
    {key: 'second', title: 'Healthy Tips'},
  ]);

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
    />
  );
}

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
  link: {
    fontSize: 16,
    marginBottom: 10,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default TipsScreen;
