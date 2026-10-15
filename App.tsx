import React, { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
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
const settingsMenuImage = require('./assets/buttons/settings-menu.png');

type WelcomeAction = 'Create Game' | 'Join Game';

function showMessage(title: string, message: string) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    return;
  }
  Alert.alert(title, message);
}

function showComingSoon(action: WelcomeAction) {
  showMessage(action, `${action} will be connected when we build that screen.`);
}

const howToPlayText =
  'RISK THE WIN — QUICK RULES\n\n' +
  '• Match the active color or the character shown on the top discard card.\n' +
  '• Colored special cards must match the active color. A Wild can be played on any turn and lets you choose a color.\n' +
  '• On a normal turn, draw until you find a playable card. You may keep drawing, then play any legal card you drew that turn.\n' +
  '• Skip skips the next player. Reverse changes the direction of play.\n' +
  '• Challenge: the next player may play a matching character card instead of drawing two cards. A Wild is not a Challenge response.\n' +
  '• Triple Draw: the next player draws three cards unless they stack a Triple Draw. The first card must match the active color; later stacked cards may be any color.\n' +
  '• If a Challenge response is your last card, Final Showdown starts. The selected opponent gets a multiple-choice question with a 20-second timer.\n' +
  '• The first player to get rid of all their cards wins, unless Final Showdown rules decide the result.';

export default function App() {
  const { width, height } = useWindowDimensions();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  const [soundEffectsOn, setSoundEffectsOn] = useState(true);
  const [backgroundMusicOn, setBackgroundMusicOn] = useState(true);
  const compact = width < 500;
  const menuWidth = Math.min(width, height * (2 / 3));
  const buttonWidth = Math.min(menuWidth * 0.84, 440);
  const buttonHeight = Math.max(54, Math.min(buttonWidth * 0.235, 94));
  const settingsSize = Math.max(20, Math.min(width * 0.17, 84)) / 3;
  // Keep the settings artwork at roughly half its previous size.
  const settingsPanelWidth = Math.min(width * 0.705, height * 0.615, 465);

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
              onPress={() => setSettingsOpen(true)}
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

        {settingsOpen && (
          <View style={styles.settingsOverlay}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close settings"
              onPress={() => setSettingsOpen(false)}
              style={styles.dismissArea}
            />
            <View
              style={[
                styles.settingsPanel,
                {
                  width: settingsPanelWidth,
                  height: settingsPanelWidth * (1311 / 1279),
                },
              ]}
            >
              <Image
                source={settingsMenuImage}
                style={styles.settingsMenuArtwork}
                resizeMode="stretch"
                accessibilityLabel="Settings menu with sound effects, background music, how to play, and back"
              />
              {/* Narrow tap targets so the decorative left/right gems aren't clickable. */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={soundEffectsOn ? 'Turn sound effects off' : 'Turn sound effects on'}
                onPress={() => setSoundEffectsOn((value) => !value)}
                style={[styles.hotspot, { left: '64%', top: '42%', width: '22%', height: '9%' }]}
              >
                <View style={[styles.statusPill, soundEffectsOn ? styles.statusOn : styles.statusOff]}>
                  <Text style={styles.statusText}>{soundEffectsOn ? 'ON' : 'OFF'}</Text>
                </View>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={backgroundMusicOn ? 'Turn background music off' : 'Turn background music on'}
                onPress={() => setBackgroundMusicOn((value) => !value)}
                style={[styles.hotspot, { left: '64%', top: '54%', width: '22%', height: '9%' }]}
              >
                <View style={[styles.statusPill, backgroundMusicOn ? styles.statusOn : styles.statusOff]}>
                  <Text style={styles.statusText}>{backgroundMusicOn ? 'ON' : 'OFF'}</Text>
                </View>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="How to Play"
                onPress={() => setHowToPlayOpen(true)}
                style={[styles.hotspot, { left: '17%', top: '65%', width: '66%', height: '10%' }]}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to welcome screen"
                onPress={() => setSettingsOpen(false)}
                style={[styles.hotspot, { left: '20%', top: '77%', width: '60%', height: '11%' }]}
              />
            </View>
          </View>
        )}
        {howToPlayOpen && (
          <View style={styles.howToPlayOverlay}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close How to Play"
              onPress={() => setHowToPlayOpen(false)}
              style={styles.howToPlayBackdrop}
            />
            <View style={[styles.howToPlayPanel, { width: Math.min(width * 0.88, 520), maxHeight: height * 0.82 }]}>
              <View style={styles.howToPlayHeader}>
                <Text style={styles.howToPlayTitle}>HOW TO PLAY</Text>
                <Text style={styles.howToPlaySubtitle}>RISK THE WIN • QUICK RULES</Text>
              </View>
              <ScrollView style={styles.howToPlayScroll} contentContainerStyle={styles.howToPlayContent}>
                <Text style={styles.ruleHeading}>YOUR TURN</Text>
                <Text style={styles.ruleText}>Match the active color or the character on the top discard card. If you don't have a playable card, draw. You may keep drawing and then play any legal card you drew that turn.</Text>
                <Text style={styles.ruleHeading}>SPECIAL CARDS</Text>
                <Text style={styles.ruleText}>• SKIP — the next player loses their turn.</Text>
                <Text style={styles.ruleText}>• REVERSE — changes the direction of play.</Text>
                <Text style={styles.ruleText}>• WILD — choose any of the four colors. It cannot answer a Challenge.</Text>
                <Text style={styles.ruleText}>• CHALLENGE — the next player may play a matching character card instead of drawing two cards.</Text>
                <Text style={styles.ruleText}>• TRIPLE DRAW — the next player draws three cards unless they stack a Triple Draw. The first must match the active color; later stacked cards can be any color.</Text>
                <Text style={styles.ruleHeading}>FINAL SHOWDOWN</Text>
                <Text style={styles.ruleText}>If a Challenge response is your last card, Final Showdown starts immediately. The selected opponent answers a multiple-choice question within 20 seconds.</Text>
                <Text style={styles.ruleHeading}>HOW TO WIN</Text>
                <Text style={styles.ruleText}>Get rid of all your cards to win, unless Final Showdown rules decide the result. If only one active player remains, that player wins.</Text>
              </ScrollView>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to Settings"
                onPress={() => setHowToPlayOpen(false)}
                style={({ pressed }) => [styles.howToPlayBackButton, { opacity: pressed ? 0.82 : 1 }]}
              >
                <Text style={styles.howToPlayBackText}>BACK</Text>
              </Pressable>
            </View>
          </View>
        )}
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
  settingsOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  dismissArea: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
  },
  settingsPanel: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsMenuArtwork: {
    width: '100%',
    height: '100%',
  },
  hotspot: {
    position: 'absolute',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    minWidth: 38,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F8D98A',
  },
  statusOn: {
    backgroundColor: '#21864A',
  },
  statusOff: {
    backgroundColor: '#6B2733',
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    textAlign: 'center',
  },
  howToPlayOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  howToPlayBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 8, 25, 0.78)',
  },
  howToPlayPanel: {
    backgroundColor: '#082C70',
    borderColor: '#F7C94A',
    borderWidth: 4,
    borderRadius: 28,
    padding: 12,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 18,
  },
  howToPlayHeader: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderColor: '#DFAE32',
    borderRadius: 18,
    backgroundColor: '#123F91',
    marginBottom: 10,
  },
  howToPlayTitle: {
    color: '#FFE66D',
    fontSize: 27,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: '#4D1B08',
    textShadowOffset: { width: 1, height: 3 },
    textShadowRadius: 2,
  },
  howToPlaySubtitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 3,
  },
  howToPlayScroll: {
    flexShrink: 1,
  },
  howToPlayContent: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  ruleHeading: {
    color: '#FFE66D',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 9,
    marginBottom: 4,
    letterSpacing: 0.6,
  },
  ruleText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 5,
    fontWeight: '500',
  },
  howToPlayBackButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 11,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#F7D35C',
    backgroundColor: '#5D28A6',
  },
  howToPlayBackText: {
    color: '#FFF1A3',
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 1.5,
    textShadowColor: '#31115C',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
  },
});