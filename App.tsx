import React from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

const backgroundImage = require('./assets/backgrounds/welcome-background.png');
const createGameImage = require('./assets/buttons/create-game.png');
const joinGameImage = require('./assets/buttons/join-game.png');
const settingsImage = require('./assets/buttons/settings-button.png');

type WelcomeAction = 'Create Game' | 'Join Game' | 'Settings';

function showComingSoon(action: WelcomeAction) {
  const message = `${action} will be connected when we build that screen.`;

  if (Platform.OS === 'web') {
    // Use a browser alert for now; replace this with navigation when the next screens are built.
    window.alert(message);
    return;
  }

  Alert.alert(action, message);
}

export default function App() {
  const { width, height } = useWindowDimensions();
  const compact = width < 500;
  const menuWidth = Math.min(width, height * (2 / 3));
  const buttonWidth = Math.min(menuWidth * 0.84, 440);
  const buttonHeight = Math.max(54, Math.min(buttonWidth * 0.235, 94));
  const settingsSize = Math.max(20, Math.min(width * 0.17, 84)) / 3;

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <ExpoStatusBar hidden />
      <ImageBackground
        source={backgroundImage}
        resizeMode="contain"
        style={styles.background}
        imageStyle={styles.backgroundImage}
        accessibilityLabel="RISK THE WIN welcome background"
      >
        <View style={[styles.controls, { paddingBottom: Math.max(24, height * 0.045) }]}>
          <View style={[styles.menu, { width: menuWidth }]}>
          <View style={styles.mainButtons}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Create Game"
              onPress={() => showComingSoon('Create Game')}
              style={({ pressed }) => [
                styles.mainButton,
                { width: buttonWidth, height: buttonHeight, opacity: pressed ? 0.82 : 1 },
              ]}
            >
              <Image source={createGameImage} style={styles.buttonArtwork} resizeMode="contain" />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Join Game"
              onPress={() => showComingSoon('Join Game')}
              style={({ pressed }) => [
                styles.mainButton,
                { width: buttonWidth, height: buttonHeight, opacity: pressed ? 0.82 : 1 },
              ]}
            >
              <Image source={joinGameImage} style={styles.buttonArtwork} resizeMode="contain" />
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Settings"
            onPress={() => showComingSoon('Settings')}
            style={({ pressed }) => [
              styles.settingsButton,
              {
                width: settingsSize,
                height: settingsSize,
                right: compact ? 22 : 36,
                top: compact ? 24 : 32,
                opacity: pressed ? 0.82 : 1,
              },
            ]}
          >
            <Image source={settingsImage} style={styles.settingsArtwork} resizeMode="contain" />
          </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#10131B',
    minHeight: '100%',
  },
  background: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
    justifyContent: 'flex-end',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  controls: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    gap: 8,
  },
  menu: {
    height: '100%',
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  mainButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  mainButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonArtwork: {
    width: '100%',
    height: '100%',
  },
  settingsButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsArtwork: {
    width: '100%',
    height: '100%',
  },
});