import React, { useState } from 'react';
import {
  Alert, Image, ImageBackground, Platform, Pressable, ScrollView,
  StatusBar, StyleSheet, Text, TextInput, View, useWindowDimensions,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

const backgroundImage = require('./assets/backgrounds/welcome-background.png');
const lobbyBackgroundImage = require('./assets/backgrounds/lobby-character-selection.png');
const createGameImage = require('./assets/buttons/create-game.png');
const joinGameImage = require('./assets/buttons/join-game.png');
const settingsImage = require('./assets/buttons/settings-button.png');
const settingsMenuImage = require('./assets/buttons/settings-menu.png');
const howToPlayMenuImage = require('./assets/buttons/how-to-play-menu.png');

type WelcomeAction = 'Create Game' | 'Join Game';
type Screen = 'welcome' | 'lobby';
const characters = ['Boone', 'Ling Ling', 'Meemaw', 'Juby', 'Face', 'Bug', 'Theone', 'Beanz', 'Chicken Joe'];
const characterPortraits: Record<string, any> = {
  'Boone': require('./assets/characters/boone.png'),
  'Ling Ling': require('./assets/characters/ling-ling.png'),
  'Meemaw': require('./assets/characters/meemaw.png'),
  'Juby': require('./assets/characters/juby.png'),
  'Face': require('./assets/characters/face.png'),
  'Bug': require('./assets/characters/bug.png'),
  'Theone': require('./assets/characters/theone.png'),
  'Beanz': require('./assets/characters/beanz.png'),
  'Chicken Joe': require('./assets/characters/chicken-joe.png'),
};

function showMessage(title: string, message: string) {
  if (Platform.OS === 'web') { window.alert(`${title}\n\n${message}`); return; }
  Alert.alert(title, message);
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
  const [screen, setScreen] = useState<Screen>('welcome');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  const [soundEffectsOn, setSoundEffectsOn] = useState(true);
  const [backgroundMusicOn, setBackgroundMusicOn] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('WIN-482');
  const [joinedPlayers, setJoinedPlayers] = useState<{name: string; character: string}[]>([]);
  const compact = width < 500;
  const menuWidth = Math.min(width, height * (2 / 3));
  const buttonWidth = Math.min(menuWidth * 0.84, 440);
  const buttonHeight = Math.max(54, Math.min(buttonWidth * 0.235, 94));
  const settingsSize = Math.max(20, Math.min(width * 0.17, 84)) / 3;
  const settingsPanelWidth = Math.min(width * 0.705, height * 0.615, 465);

  function enterLobby(action: WelcomeAction) {
    setScreen('lobby');
    if (action === 'Create Game') setRoomCode('WIN-482');
  }
  function saveAndJoin() {
    const name = playerName.trim();
    if (!name) { showMessage('Player name needed', 'Enter the name you want other players to see.'); return; }
    if (!selectedCharacter) { showMessage('Choose a character', 'Select one of the nine characters first.'); return; }
    const alreadyTaken = joinedPlayers.some(p => p.character === selectedCharacter);
    if (alreadyTaken) { showMessage('Character taken', 'Choose a character that has not been claimed.'); return; }
    if (joinedPlayers.length >= 8) { showMessage('Room full', 'This room is limited to 8 players.'); return; }
    setJoinedPlayers(previous => [...previous, { name, character: selectedCharacter }]);
    setPlayerName('');
    setSelectedCharacter(null);
    showMessage('Joined lobby', 'Your player is listed as Ready on this device. Online multiplayer still needs a server connection.');
  }

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <ExpoStatusBar hidden />
      <ImageBackground source={screen === 'lobby' ? lobbyBackgroundImage : backgroundImage} resizeMode={screen === 'lobby' ? 'stretch' : 'contain'} style={styles.background} imageStyle={styles.backgroundImage}>
        {screen === 'welcome' ? (
          <View style={[styles.controls, { paddingBottom: Math.max(24, height * 0.045) }]}>
            <View style={[styles.menu, { width: menuWidth }]}>
              <View style={styles.mainButtons}>
                <Pressable accessibilityRole="button" accessibilityLabel="Create Game" onPress={() => enterLobby('Create Game')} style={({pressed}) => [styles.mainButton,{width:buttonWidth,height:buttonHeight,opacity:pressed?0.82:1}]}>
                  <Image source={createGameImage} style={styles.buttonArtwork} resizeMode="contain" />
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel="Join Game" onPress={() => enterLobby('Join Game')} style={({pressed}) => [styles.mainButton,{width:buttonWidth,height:buttonHeight,opacity:pressed?0.82:1}]}>
                  <Image source={joinGameImage} style={styles.buttonArtwork} resizeMode="contain" />
                </Pressable>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Settings" onPress={() => setSettingsOpen(true)} style={({pressed}) => [styles.settingsButton,{width:settingsSize,height:settingsSize,right:compact?22:36,top:compact?24:32,opacity:pressed?0.82:1}]}>
                <Image source={settingsImage} style={styles.settingsArtwork} resizeMode="contain" />
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.lobbyArtworkRoot}>
            {/* The uploaded lobby artwork is the screen background; these controls sit over its matching areas. */}
            {characters.map((character, index) => {
              const col = index % 3;
              const row = Math.floor(index / 3);
              const taken = joinedPlayers.some(p => p.character === character);
              const selected = selectedCharacter === character;
              return (
                <Pressable
                  key={character}
                  accessibilityRole="button"
                  accessibilityLabel={`Choose ${character}`}
                  disabled={taken}
                  onPress={() => setSelectedCharacter(character)}
                  style={[
                    styles.lobbyPortraitSlot,
                    { left: `${6.0 + col * 18.1}%`, top: `${33.7 + row * 12.1}%`, width: '16.5%', height: '10.8%' },
                    selected && styles.lobbyPortraitSelected,
                    taken && styles.lobbyPortraitTaken,
                  ]}
                >
                  <Image source={characterPortraits[character]} style={styles.lobbyPortraitImage} resizeMode="contain" accessibilityLabel={character} />
                </Pressable>
              );
            })}
            <Pressable accessibilityRole="button" accessibilityLabel="Back to welcome screen" onPress={() => setScreen('welcome')} style={[styles.lobbyHotspot, { left: '1%', top: '6%', width: '25%', height: '7%' }]} />
            <Pressable accessibilityRole="button" accessibilityLabel="Start game" onPress={() => showMessage('Start Game', selectedCharacter ? `You selected ${selectedCharacter}. Online multiplayer and game start still need the server connection.` : 'Choose a character first.')} style={[styles.lobbyHotspot, { left: '3%', top: '85%', width: '48%', height: '10%' }]} />
            <Pressable accessibilityRole="button" accessibilityLabel="Invite friends" onPress={() => showMessage('Invite Friends', 'The lobby artwork is in place. Room creation and invitations need the multiplayer server connection.')} style={[styles.lobbyHotspot, { left: '54%', top: '85%', width: '43%', height: '10%' }]} />
            <Pressable accessibilityRole="button" accessibilityLabel="Copy room code" onPress={() => showMessage('Room Code', 'Room code entry and sharing will be connected when the multiplayer lobby server is added.')} style={[styles.lobbyHotspot, { left: '45%', top: '19%', width: '11%', height: '7%' }]} />
          </View>
        )}
        {settingsOpen && !howToPlayOpen && screen === 'welcome' && (
          <View style={styles.settingsOverlay}>
            <Pressable accessibilityRole="button" accessibilityLabel="Close settings" onPress={() => setSettingsOpen(false)} style={styles.dismissArea} />
            <View style={[styles.settingsPanel,{width:settingsPanelWidth,height:settingsPanelWidth*(1311/1279)}]}>
              <Image source={settingsMenuImage} style={styles.settingsMenuArtwork} resizeMode="stretch" />
              <Pressable accessibilityRole="button" accessibilityLabel={soundEffectsOn?'Turn sound effects off':'Turn sound effects on'} onPress={()=>setSoundEffectsOn(v=>!v)} style={[styles.hotspot,{left:'64%',top:'42%',width:'22%',height:'9%'}]}><View style={[styles.statusPill,soundEffectsOn?styles.statusOn:styles.statusOff]}><Text style={styles.statusText}>{soundEffectsOn?'ON':'OFF'}</Text></View></Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel={backgroundMusicOn?'Turn background music off':'Turn background music on'} onPress={()=>setBackgroundMusicOn(v=>!v)} style={[styles.hotspot,{left:'64%',top:'54%',width:'22%',height:'9%'}]}><View style={[styles.statusPill,backgroundMusicOn?styles.statusOn:styles.statusOff]}><Text style={styles.statusText}>{backgroundMusicOn?'ON':'OFF'}</Text></View></Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="How to Play" onPress={()=>setHowToPlayOpen(true)} style={[styles.hotspot,{left:'17%',top:'65%',width:'66%',height:'10%'}]} />
              <Pressable accessibilityRole="button" accessibilityLabel="Back to welcome screen" onPress={()=>setSettingsOpen(false)} style={[styles.hotspot,{left:'20%',top:'77%',width:'60%',height:'11%'}]} />
            </View>
          </View>
        )}
        {howToPlayOpen && screen === 'welcome' && (
          <View style={styles.howToPlayOverlay}>
            <Pressable accessibilityRole="button" accessibilityLabel="Close How to Play" onPress={()=>setHowToPlayOpen(false)} style={styles.howToPlayBackdrop} />
            <View style={[styles.howToPlayArtworkPanel,{width:Math.min(width*0.94,height*0.82*(2/3),600),height:Math.min(width*0.94,height*0.82*(2/3),600)*1.5}]}>
              <Image source={howToPlayMenuImage} style={styles.howToPlayArtwork} resizeMode="contain" accessibilityLabel="RISK THE WIN How to Play rules menu" />
              <Pressable accessibilityRole="button" accessibilityLabel="Back to Settings" onPress={()=>setHowToPlayOpen(false)} style={[styles.howToPlayBackHotspot,{left:'22%',top:'89%',width:'56%',height:'9%'}]} />
            </View>
          </View>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root:{flex:1,backgroundColor:'#10131B',minHeight:'100%'},
  background:{flex:1,width:'100%',minHeight:'100%',justifyContent:'flex-end'},
  backgroundImage:{width:'100%',height:'100%'},
  controls:{flex:1,width:'100%',alignItems:'center',justifyContent:'flex-end',position:'relative',gap:8},
  menu:{height:'100%',maxWidth:'100%',alignItems:'center',justifyContent:'flex-end',position:'relative'},
  mainButtons:{alignItems:'center',justifyContent:'center',gap:6},
  mainButton:{alignItems:'center',justifyContent:'center'},
  buttonArtwork:{width:'100%',height:'100%'},
  settingsButton:{position:'absolute',alignItems:'center',justifyContent:'center'},
  settingsArtwork:{width:'100%',height:'100%'},
  lobbyArtworkRoot:{...StyleSheet.absoluteFillObject,backgroundColor:'transparent'},
  lobbyHotspot:{position:'absolute',backgroundColor:'transparent'},
  lobbyPortraitSlot:{position:'absolute',alignItems:'center',justifyContent:'center',overflow:'hidden',borderRadius:10},
  lobbyPortraitImage:{width:'100%',height:'100%'},
  lobbyPortraitSelected:{borderColor:'#FFF2A2',borderWidth:2,backgroundColor:'rgba(255,211,77,0.18)'},
  lobbyPortraitTaken:{opacity:0.35},
  lobbyRoot:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(7,12,28,0.34)',paddingTop:Platform.OS==='web'?18:30,paddingHorizontal:12,paddingBottom:8},
  lobbyTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,marginBottom:10},
  roomHeader:{alignItems:'center',flex:1},
  lobbyTitle:{color:'#F6D58A',fontSize:20,fontWeight:'900',letterSpacing:2},
  roomMeta:{color:'#F5EAD1',fontSize:11,fontWeight:'800',marginTop:4,letterSpacing:1},
  smallButton:{borderColor:'#C8A45B',borderWidth:1,borderRadius:9,paddingHorizontal:10,paddingVertical:9,backgroundColor:'#292131'},
  smallButtonText:{color:'#F8D98A',fontSize:11,fontWeight:'900'},
  lobbyScroll:{paddingBottom:18},
  lobbyColumns:{flexDirection:'column',alignItems:'stretch',gap:12,maxWidth:1100,width:'100%',alignSelf:'center'},
  pickPanel:{flex:1.05,backgroundColor:'rgba(7,16,37,0.88)',borderColor:'#9C793E',borderWidth:1,borderRadius:16,padding:12},
  playersPanel:{flex:0.95,backgroundColor:'rgba(28,27,38,0.94)',borderColor:'#9C793E',borderWidth:1,borderRadius:16,padding:12},
  panelTitle:{color:'#F6D58A',fontSize:14,fontWeight:'900',letterSpacing:1.1},
  panelSub:{color:'#D2C7B2',fontSize:11,marginTop:4,marginBottom:12},
  characterGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:7},
  characterTile:{width:'31%',minWidth:78,maxWidth:150,alignItems:'center',paddingVertical:8,paddingHorizontal:4,borderWidth:1,borderColor:'#9C793E',borderRadius:10,backgroundColor:'rgba(32,29,42,0.96)'},
  characterSelected:{borderColor:'#F6D58A',backgroundColor:'#443521',borderWidth:2},
  characterTaken:{opacity:0.42},
  avatarFrame:{width:'100%',maxWidth:100,aspectRatio:1,borderRadius:8,overflow:'hidden',alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'#D5B36D',marginBottom:6,backgroundColor:'#17131B'},
  avatarPortrait:{width:'100%',height:'100%'},
  characterName:{color:'#FFF5E2',fontWeight:'800',fontSize:11},
  tileStatus:{color:'#D7B66F',fontSize:8,fontWeight:'900',marginTop:4},
  fieldLabel:{color:'#F6D58A',fontSize:10,fontWeight:'900',marginTop:14,marginBottom:6,letterSpacing:1},
  nameInput:{borderWidth:1,borderColor:'#78664D',borderRadius:9,color:'#FFFFFF',paddingHorizontal:12,paddingVertical:10,backgroundColor:'#15141D',fontSize:14},
  joinButton:{backgroundColor:'#236D45',borderWidth:1,borderColor:'#7BD39B',borderRadius:10,alignItems:'center',padding:13,marginTop:9},
  joinButtonText:{color:'#FFFFFF',fontSize:13,fontWeight:'900',letterSpacing:1.2},
  playerRow:{flexDirection:'row',alignItems:'center',paddingVertical:8,borderBottomWidth:1,borderBottomColor:'#443B45',gap:8,minHeight:52},
  playerNumber:{width:28,height:28,borderRadius:14,backgroundColor:'#4B3B2C',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#A8874C'},
  playerNumberText:{color:'#F6D58A',fontWeight:'900',fontSize:11},
  playerInfo:{flex:1},
  playerName:{color:'#FFF5E2',fontWeight:'800',fontSize:12},
  playerCharacter:{color:'#C4B8A3',fontSize:10,marginTop:2},
  readyTag:{color:'#8EE0A8',fontWeight:'900',fontSize:9},
  waitingTag:{color:'#A9A3AD'},
  startButton:{backgroundColor:'#8A642C',borderColor:'#E7C778',borderWidth:1,borderRadius:10,alignItems:'center',padding:13,marginTop:14},
  startButtonText:{color:'#FFFFFF',fontWeight:'900',letterSpacing:1.5},
  localNote:{color:'#B8A77F',fontSize:8,textAlign:'center',marginTop:9,letterSpacing:1},
  settingsOverlay:{...StyleSheet.absoluteFillObject,zIndex:10,alignItems:'center',justifyContent:'center',padding:8},
  dismissArea:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.22)'},
  settingsPanel:{position:'relative',alignItems:'center',justifyContent:'center'},
  settingsMenuArtwork:{width:'100%',height:'100%'},
  hotspot:{position:'absolute',backgroundColor:'transparent',alignItems:'center',justifyContent:'center'},
  statusPill:{minWidth:38,paddingHorizontal:8,paddingVertical:4,borderRadius:12,borderWidth:1,borderColor:'#F8D98A'},
  statusOn:{backgroundColor:'#21864A'},statusOff:{backgroundColor:'#6B2733'},
  statusText:{color:'#FFFFFF',fontWeight:'800',fontSize:12,textAlign:'center'},
  howToPlayOverlay:{...StyleSheet.absoluteFillObject,zIndex:20,alignItems:'center',justifyContent:'center',padding:12},
  howToPlayBackdrop:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(5,8,25,0.78)'},
  howToPlayArtworkPanel:{position:'relative',alignItems:'center',justifyContent:'center'},
  howToPlayArtwork:{width:'100%',height:'100%'},
  howToPlayBackHotspot:{position:'absolute',backgroundColor:'transparent'},
});