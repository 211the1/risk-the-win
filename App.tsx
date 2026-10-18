import React, { useEffect, useRef, useState } from 'react';
import {
  Alert, Image, ImageBackground, PanResponder, Platform, Pressable, ScrollView,
  StatusBar, StyleSheet, Text, TextInput, View, useWindowDimensions,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

const backgroundImage = require('./assets/screens/welcome/backgrounds/welcome-background.png');
const lobbyBackgroundImage = require('./assets/screens/lobby/backgrounds/lobby-character-selection.png');
const createGameImage = require('./assets/screens/welcome/buttons/create-game.png');
const joinGameImage = require('./assets/screens/welcome/buttons/join-game.png');
const settingsImage = require('./assets/screens/welcome/buttons/settings-button.png');
const settingsMenuImage = require('./assets/screens/welcome/buttons/settings-menu.png');
const howToPlayMenuImage = require('./assets/screens/welcome/buttons/how-to-play-menu.png');
const playerNamePanelImage = require('./assets/screens/lobby/ui/player-name-panel.png');
const mainGameBackgroundImage = require('./assets/screens/main-game/backgrounds/main-game-background.png');
const wakeUpButtonImage = require('./assets/screens/main-game/buttons/wake-up-button.png');
const emojiButtonImage = require('./assets/screens/main-game/buttons/emoji-button.png');
const sortButtonImage = require('./assets/screens/main-game/buttons/sort-button.png');
const drawButtonImage = require('./assets/screens/main-game/buttons/draw-button.png');
const talkButtonImage = require('./assets/screens/main-game/buttons/talk-button.png');
const playersDropdownImage = require('./assets/screens/main-game/buttons/players-dropdown.png');
const riskLogoImage = require('./assets/screens/welcome/logo/risk-the-win-logo.png');
const drawDiscardDecksImage = require('./assets/screens/main-game/cards/draw-discard-decks.png');
const discardTopCardImage = require('./assets/screens/main-game/cards/characters/boone-blue.png');
const handCardImages = [
  require('./assets/screens/main-game/cards/characters/boone-blue.png'),
  require('./assets/screens/main-game/cards/characters/ling-ling-red.png'),
  require('./assets/screens/main-game/cards/characters/meemaw-green.png'),
  require('./assets/screens/main-game/cards/characters/juby-yellow.png'),
  require('./assets/screens/main-game/cards/characters/bug-blue.png'),
  require('./assets/screens/main-game/cards/characters/face-red.png'),
  require('./assets/screens/main-game/cards/characters/beanz-green.png'),
  require('./assets/screens/main-game/cards/characters/chicken-joe-yellow.png'),
];

type WelcomeAction = 'Create Game' | 'Join Game';
type Screen = 'welcome' | 'lobby' | 'main-game';
const characters = ['Boone', 'Ling Ling', 'Meemaw', 'Juby', 'Face', 'Bug', 'Theone', 'Beanz', 'Chicken Joe', 'Bob', 'Jayme', 'Trevor'];
const playableCharacters = ['Boone', 'Ling Ling', 'Meemaw', 'Juby', 'Bug', 'Face', 'Theone', 'Beanz', 'Chicken Joe'];
const characterPortraits: Record<string, any> = {
  'Boone': require('./assets/shared/characters/boone.png'),
  'Ling Ling': require('./assets/shared/characters/ling-ling.png'),
  'Meemaw': require('./assets/shared/characters/meemaw.png'),
  'Juby': require('./assets/shared/characters/juby.png'),
  'Face': require('./assets/shared/characters/face.png'),
  'Bug': require('./assets/shared/characters/bug.png'),
  'Theone': require('./assets/shared/characters/theone.png'),
  'Beanz': require('./assets/shared/characters/beanz.png'),
  'Chicken Joe': require('./assets/shared/characters/chicken-joe.png'),
  'Bob': require('./assets/shared/characters/bob.png'),
  'Jayme': require('./assets/shared/characters/jayme.png'),
  'Trevor': require('./assets/shared/characters/trevor.png'),
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

function MovableItem({ children, editMode, style, label, layoutId }: { children: React.ReactNode; editMode: boolean; style?: any; label: string; layoutId: string }) {
  const storageKey = 'risk-the-win-layout-v2-' + layoutId;
  const [savedLayout, setSavedLayout] = useState(() => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const saved = window.localStorage.getItem(storageKey) || window.sessionStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.offset && Number.isFinite(parsed.offset.x) && Number.isFinite(parsed.offset.y) && Number.isFinite(parsed.scale)) return parsed;
        }
      }
    } catch {}
    return { offset: { x: 0, y: 0 }, scale: 1 };
  });
  const [offset, setOffset] = useState(savedLayout.offset);
  const [scale, setScale] = useState(savedLayout.scale);
  const saveLayout = (nextOffset: {x:number;y:number}, nextScale: number) => {
    const next = { offset: nextOffset, scale: nextScale };
    setSavedLayout(next);
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const serialized = JSON.stringify(next);
        window.localStorage.setItem(storageKey, serialized);
        window.sessionStorage.setItem(storageKey, serialized);
      }
    } catch {}
  };
  const start = useRef({ x: 0, y: 0 });
  const offsetRef = useRef(offset);
  const editModeRef = useRef(editMode);
  const scaleRef = useRef(scale);
  editModeRef.current = editMode;
  scaleRef.current = scale;
  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => editModeRef.current,
    onMoveShouldSetPanResponder: () => editModeRef.current,
    onPanResponderGrant: () => { start.current = offsetRef.current; },
    onPanResponderMove: (_, g) => { const n = { x: start.current.x + g.dx, y: start.current.y + g.dy }; offsetRef.current = n; setOffset(n); saveLayout(n, scaleRef.current); },
    onPanResponderRelease: (_, g) => { const n = { x: start.current.x + g.dx, y: start.current.y + g.dy }; offsetRef.current = n; setOffset(n); saveLayout(n, scaleRef.current); },
  })).current;
  return <View {...pan.panHandlers} accessibilityLabel={label} style={[style, { transform: [{ translateX: offset.x }, { translateY: offset.y }, { scale }] }]}>
    {children}
    {editMode && <View style={styles.layoutItemControls}>
      <Pressable onPress={() => setScale(s => { const n = Number((s + 0.1).toFixed(2)); saveLayout(offset, n); return n; })} style={styles.layoutItemButton}><Text style={styles.layoutItemButtonText}>+</Text></Pressable>
      <Pressable onPress={() => setScale(s => { const n = Math.max(0.05, Number((s - 0.1).toFixed(2))); saveLayout(offset, n); return n; })} style={styles.layoutItemButton}><Text style={styles.layoutItemButtonText}>−</Text></Pressable>
    </View>}
  </View>;
}

export default function App() {
  const { width, height } = useWindowDimensions();
  const [screen, setScreen] = useState<Screen>('welcome');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  const [soundEffectsOn, setSoundEffectsOn] = useState(true);
  const [backgroundMusicOn, setBackgroundMusicOn] = useState(true);
  const [layoutEditMode, setLayoutEditMode] = useState(true);
  const [playerDropdownOpen, setPlayerDropdownOpen] = useState(false);
  const [displayedPlayer, setDisplayedPlayer] = useState('Boone');
  const [gameLogoVisible, setGameLogoVisible] = useState(true);
  useEffect(() => {
    if (screen !== 'main-game') { setGameLogoVisible(true); return; }
    setGameLogoVisible(true);
    const logoTimer = setTimeout(() => setGameLogoVisible(false), 600000);
    return () => clearTimeout(logoTimer);
  }, [screen]);
  const [topCharacter] = useState(() => characterPortraits[characters[Math.floor(Math.random() * characters.length)]]);
  const [handCards, setHandCards] = useState(handCardImages);
  const [selectedHandCard, setSelectedHandCard] = useState<number | null>(null);
  const [browsedHandCard, setBrowsedHandCard] = useState<number>(0);
  const [fanSpread, setFanSpread] = useState(1);
  const fanGestureStart = useRef({ x: 0, y: 0, spread: 1, browsed: 0 });
  const fanGestureResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (_, g) => !layoutEditMode && (Math.abs(g.dx) > 8 || Math.abs(g.dy) > 8),
    onPanResponderGrant: () => { fanGestureStart.current = { x: 0, y: 0, spread: fanSpread, browsed: browsedHandCard }; },
    onPanResponderMove: (_, g) => {
      const maxIndex = Math.max(0, handCards.length - 1);
      if (Math.abs(g.dx) > Math.abs(g.dy)) {
        const step = Math.round(-g.dx / 34);
        setBrowsedHandCard(Math.max(0, Math.min(maxIndex, fanGestureStart.current.browsed + step)));
      } else {
        setFanSpread(Math.max(0.45, Math.min(1.8, fanGestureStart.current.spread + (-g.dy / 170))));
      }
    },
    onPanResponderRelease: () => {},
  })).current;
  const [topDiscardCard, setTopDiscardCard] = useState(discardTopCardImage);
  const [handOffset, setHandOffset] = useState({ x: 0, y: 0 });
  const [handScale, setHandScale] = useState(1);
  const handTransformStart = useRef({ x: 0, y: 0 });
  const handOffsetRef = useRef({ x: 0, y: 0 });
  const handDragStart = useRef({ x: 0, y: 0 });
  const handPanResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { handDragStart.current = handOffsetRef.current; },
    onPanResponderMove: (_, gesture) => { const next = { x: handDragStart.current.x + gesture.dx, y: handDragStart.current.y + gesture.dy }; handOffsetRef.current = next; setHandOffset(next); },
    onPanResponderRelease: (_, gesture) => { const next = { x: handDragStart.current.x + gesture.dx, y: handDragStart.current.y + gesture.dy }; handOffsetRef.current = next; setHandOffset(next); },
  })).current;
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [pendingCharacter, setPendingCharacter] = useState<string | null>(null);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('WIN-482');
  const [joinedPlayers, setJoinedPlayers] = useState<{name: string; character: string}[]>([]);
  const compact = width < 500;
  const menuWidth = Math.min(width, height * (2 / 3));
  const buttonWidth = Math.min(menuWidth * 0.84, 440);
  const buttonHeight = Math.max(54, Math.min(buttonWidth * 0.235, 94));
  const settingsSize = Math.max(20, Math.min(width * 0.17, 84)) / 3;
  const settingsPanelWidth = Math.min(width * 0.705, height * 0.615, 465);

  function generateRoomCode() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
    setRoomCode(code);
    showMessage('Room Created', `Your room code is ${code}. Share it with friends so they can enter the same code.`);
  }

  function copyRoomCode() {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(roomCode)
        .then(() => showMessage('Room Code Copied', `Room code ${roomCode} is ready to paste.`))
        .catch(() => showMessage('Room Code', roomCode));
    } else {
      showMessage('Room Code', roomCode);
    }
  }

  function inviteFriends() {
    const message = `Join my RISK THE WIN game! Room code: ${roomCode}. Open RISK THE WIN and enter this code to join.`;
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(message)
        .then(() => showMessage('Invite Ready', 'Your invite message has been copied. Send it to your friends!'))
        .catch(() => showMessage('Invite Friends', message));
    } else {
      showMessage('Invite Friends', message);
    }
  }
  function enterLobby(action: WelcomeAction) {
    setScreen('lobby');
    if (action === 'Create Game') generateRoomCode();
  }
  function saveAndJoin() {
    const name = playerName.trim();
    if (!name) { showMessage('Player name needed', 'Enter the name you want other players to see.'); return; }
    const characterToJoin = pendingCharacter;
    if (!characterToJoin) { showMessage('Choose a character', 'Tap one of the nine character portraits first.'); return; }
    const alreadyTaken = joinedPlayers.some(p => p.character === characterToJoin);
    if (alreadyTaken) { showMessage('Character taken', 'Choose a character that has not been claimed.'); return; }
    if (joinedPlayers.length >= 9) { showMessage('Room full', 'This room is limited to 9 players.'); return; }
    setJoinedPlayers(previous => [...previous, { name, character: characterToJoin }]);
    setPlayerName('');
    setSelectedCharacter(null);
    setPendingCharacter(null);
    setJoinDialogOpen(false);
  }

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <ExpoStatusBar hidden />
      <ImageBackground source={screen === 'main-game' ? mainGameBackgroundImage : screen === 'lobby' ? lobbyBackgroundImage : backgroundImage} resizeMode={screen === 'welcome' ? 'contain' : 'stretch'} style={styles.background} imageStyle={styles.backgroundImage}>
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
        ) : screen === 'lobby' ? (
          <View style={styles.lobbyArtworkRoot}>
            {/* The uploaded lobby artwork is the screen background; these controls sit over its matching areas. */}
            {characters.map((character, index) => {
              const col = index % 3;
              const row = Math.floor(index / 3);
              const rowTops = [33.6, 46.0, 58.0, 69.5];
              const rowHeights = ['9.0%', '9.0%', '9.0%', '9.0%'];
              const taken = joinedPlayers.some(p => p.character === character);
              const selected = selectedCharacter === character;
              return (
                <Pressable
                  key={character}
                  accessibilityRole="button"
                  accessibilityLabel={`Choose ${character}`}
                  disabled={taken}
                  onPress={() => { setSelectedCharacter(character); setPendingCharacter(character); setPlayerName(''); setJoinDialogOpen(true); }}
                  style={[
                    styles.lobbyPortraitSlot,
                    { left: `${4.5 + col * 19.2}%`, top: `${rowTops[row]}%`, width: '17.2%', height: rowHeights[row] },
                    selected && styles.lobbyPortraitSelected,
                    taken && styles.lobbyPortraitTaken,
                  ]}
                >
                  <Image source={characterPortraits[character]} style={styles.lobbyPortraitImage} resizeMode="contain" accessibilityLabel={character} />
                </Pressable>
              );
            })}
            <View pointerEvents="box-none" style={styles.rosterPanel}>
              <Text style={styles.rosterTitle}>PLAYERS ({joinedPlayers.length} / 9)</Text>
              {Array.from({ length: 9 }, (_, index) => {
                const player = joinedPlayers[index];
                const isHostSlot = index === 0;
                return (
                  <View key={'player-slot-' + (index + 1)} style={[styles.rosterRow, !player && styles.rosterEmptyRow]}>
                    <View style={styles.rosterRank}>
                      {isHostSlot ? <Text style={styles.hostCrown}>♛</Text> : <Text style={styles.rosterRankText}>{index + 1}</Text>}
                    </View>
                    {player ? (
                      <Image source={characterPortraits[player.character]} style={styles.rosterAvatar} resizeMode="contain" />
                    ) : (
                      <View style={styles.rosterAvatarEmpty}><Text style={styles.rosterEmptyNumber}>{index + 1}</Text></View>
                    )}
                    <View style={styles.rosterCopy}>
                      <Text numberOfLines={1} style={[styles.rosterName, !player && styles.rosterWaitingName]}>{player ? player.name : (isHostSlot ? 'HOST' : 'Waiting for player')}</Text>
                      <Text numberOfLines={1} style={[styles.rosterStatus, !player && styles.rosterWaitingStatus]}>{player ? (isHostSlot ? '♛ HOST · READY' : '● READY') : (isHostSlot ? 'HOST SLOT' : 'EMPTY SLOT')}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
            <View pointerEvents="none" style={styles.roomCountBadge}>
              <Text style={styles.roomCountText}>{joinedPlayers.length} / 9</Text>
              <Text style={styles.roomCountSubtext}>PLAYERS</Text>
            </View>
            {joinDialogOpen && (
              <View style={styles.joinDialogOverlay}>
                <Pressable accessibilityRole="button" accessibilityLabel="Cancel joining" onPress={() => { setJoinDialogOpen(false); setPendingCharacter(null); setSelectedCharacter(null); }} style={styles.joinDialogBackdrop} />
                <View style={styles.joinDialog}>
                  <Image source={playerNamePanelImage} style={styles.joinPanelArtwork} resizeMode="contain" />
                  <TextInput
                    accessibilityLabel="Enter your player name"
                    value={playerName}
                    onChangeText={setPlayerName}
                    maxLength={16}
                    placeholder="Enter your name"
                    placeholderTextColor="#8792A6"
                    autoCapitalize="words"
                    autoCorrect={false}
                    style={styles.joinNameInput}
                    returnKeyType="done"
                    onSubmitEditing={saveAndJoin}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Cancel"
                    onPress={() => { setJoinDialogOpen(false); setPendingCharacter(null); setSelectedCharacter(null); setPlayerName(''); }}
                    style={styles.joinCancelButton}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Save and join"
                    onPress={saveAndJoin}
                    style={styles.joinSaveButton}
                  />
                </View>
              </View>
            )}
            <Pressable accessibilityRole="button" accessibilityLabel="Back to welcome screen" onPress={() => setScreen('welcome')} style={[styles.lobbyHotspot, { left: '1%', top: '6%', width: '25%', height: '7%' }]} />
            <Pressable accessibilityRole="button" accessibilityLabel="Start game preview" onPress={() => setScreen('main-game')} style={[styles.lobbyHotspot, { left: '3%', top: '85%', width: '48%', height: '10%' }]} />
            <Pressable accessibilityRole="button" accessibilityLabel="Invite friends" onPress={inviteFriends} style={[styles.lobbyHotspot, { left: '54%', top: '85%', width: '43%', height: '10%' }]} />
            <Pressable accessibilityRole="button" accessibilityLabel="Copy room code" onPress={copyRoomCode} style={[styles.lobbyHotspot, { left: '45%', top: '19%', width: '11%', height: '7%' }]} />
          </View>
        ) : (
          <View style={styles.gamePreviewRoot}>
            <View style={styles.gameTopBar}>
              <MovableItem editMode={layoutEditMode} label="Move and resize lobby button" layoutId="lobby-button" style={styles.gameLobbyButton}>
              <Pressable accessibilityRole="button" accessibilityLabel="Back to lobby" onPress={() => setScreen('lobby')} style={styles.gameBackButton}>
                <Text style={styles.gameBackText}>‹ LOBBY</Text>
              </Pressable>
              </MovableItem>
              <MovableItem editMode={layoutEditMode} label="Move and resize player dropdown" layoutId="player-dropdown" style={styles.gamePlayerControls}>
                <Pressable accessibilityRole="button" accessibilityLabel="Choose player character" onPress={() => setPlayerDropdownOpen(value => !value)} style={styles.playerDropdownButton}>
                  <Image source={playersDropdownImage} style={styles.playersDropdownArtwork} resizeMode="contain" />
                  <Text numberOfLines={1} style={styles.playerDropdownName}>{displayedPlayer}</Text>
                </Pressable>
                {playerDropdownOpen && <View style={styles.playerDropdownMenu}>
                  {playableCharacters.map(character => <Pressable key={character} accessibilityRole="button" onPress={() => { setDisplayedPlayer(character); setPlayerDropdownOpen(false); }} style={styles.playerDropdownOption}><Text style={styles.playerDropdownOptionText}>{character}</Text></Pressable>)}
                </View>}
              </MovableItem>
            </View>
            <View style={styles.gameDeckArea}>
              <MovableItem editMode={layoutEditMode} label="Move and resize draw and discard decks together" layoutId="decks" style={styles.gameDeckTouch}>
                <Pressable accessibilityRole="button" accessibilityLabel="Play selected card to discard pile" onPress={() => { if (selectedHandCard === null) { showMessage('Choose a card', 'Tap a card in your hand first, then tap the discard pile to play it.'); return; } const played = handCards[selectedHandCard]; setTopDiscardCard(played); setHandCards(cards => cards.filter((_, index) => index !== selectedHandCard)); setSelectedHandCard(null); }} style={styles.gameDeckTouch}>
                  <Image source={drawDiscardDecksImage} style={styles.gameDecksArtwork} resizeMode="contain" />
                </Pressable>
              </MovableItem>
              <MovableItem editMode={layoutEditMode} label="Move and resize top discard character card independently" layoutId="top-discard-card" style={styles.discardTopCardMovable}>
                <Image source={topDiscardCard} style={styles.discardTopCardArtwork} resizeMode="contain" />
              </MovableItem>
            </View>
            <View style={styles.gameBottomButtons}>
              <MovableItem editMode={layoutEditMode} label="Move and resize Wake Up button" layoutId="button-wake-up" style={styles.gameActionButton}><Pressable accessibilityRole="button" accessibilityLabel="Wake Up" onPress={() => showMessage('Wake Up', 'The button artwork is connected. Its in-game action will be added later.')} style={styles.gameActionButton}><Image source={wakeUpButtonImage} style={styles.gameActionArtwork} resizeMode="contain" /></Pressable></MovableItem>
              <MovableItem editMode={layoutEditMode} label="Move and resize Emoji button" layoutId="button-emoji" style={styles.gameActionButton}><Pressable accessibilityRole="button" accessibilityLabel="Emoji" onPress={() => showMessage('Emoji', 'The button artwork is connected. Emoji actions will be added later.')} style={styles.gameActionButton}><Image source={emojiButtonImage} style={styles.gameActionArtwork} resizeMode="contain" /></Pressable></MovableItem>
              <MovableItem editMode={layoutEditMode} label="Move and resize Straighten button" layoutId="button-sort" style={styles.gameActionButton}><Pressable accessibilityRole="button" accessibilityLabel="Straighten cards" onPress={() => showMessage('Straighten Cards', 'The button artwork is connected. Card sorting will be added later.')} style={styles.gameActionButton}><Image source={sortButtonImage} style={styles.gameActionArtwork} resizeMode="contain" /></Pressable></MovableItem>
              <MovableItem editMode={layoutEditMode} label="Move and resize Draw button" layoutId="button-draw" style={styles.gameActionButton}><Pressable accessibilityRole="button" accessibilityLabel="Draw card" onPress={() => { const next = handCardImages[(handCards.length + 3) % handCardImages.length]; setHandCards(cards => [...cards, next]); }} style={styles.gameActionButton}><Image source={drawButtonImage} style={styles.gameActionArtwork} resizeMode="contain" /></Pressable></MovableItem>
              <MovableItem editMode={layoutEditMode} label="Move and resize Push-to-Talk button" layoutId="button-talk" style={styles.gameActionButton}><Pressable accessibilityRole="button" accessibilityLabel="Push to talk" onPress={() => showMessage('Push-to-Talk', 'The button artwork is connected. Voice communication will be implemented later.')} style={styles.gameActionButton}><Image source={talkButtonImage} style={styles.gameActionArtwork} resizeMode="contain" /></Pressable></MovableItem>
            </View>
            <MovableItem editMode={layoutEditMode} label="Move and resize entire fan of hand cards" layoutId="hand-fan" style={styles.playerHandFan}>
              <View style={styles.playerHandFanInner} {...fanGestureResponder.panHandlers}>
                {handCards.map((cardImage, index) => {
                  const center = (handCards.length - 1) / 2;
                  const distance = index - center;
                  const normalized = center ? Math.abs(distance) / center : 0;
                  const angle = distance * 7 * fanSpread;
                  const curveLift = normalized * normalized * 34 * fanSpread;
                  const browseLift = index === browsedHandCard && selectedHandCard !== index ? -10 : 0;
                  return <Pressable key={`hand-card-${index}`} accessibilityRole="button" accessibilityLabel={`Select card ${index + 1}`} onPress={() => setSelectedHandCard(index)} style={[styles.playerHandCardTouch, { left: handCards.length > 1 ? `${(index / (handCards.length - 1)) * 78 * fanSpread + (1 - fanSpread) * 39}%` : '39%', zIndex: selectedHandCard === index ? 30 : index === browsedHandCard ? 25 : index + 1, transform: [{ translateY: -curveLift + browseLift + (selectedHandCard === index ? -18 : 0) }, { rotate: `${angle}deg` }] }]}>
                    <Image source={cardImage} resizeMode="contain" style={styles.playerHandCard} />
                  </Pressable>;
                })}
              </View>
            </MovableItem>
            {gameLogoVisible && <MovableItem editMode={layoutEditMode} label="Move and resize game logo" layoutId="logo" style={styles.gameLogoPosition}>
              <Image source={riskLogoImage} resizeMode="contain" style={styles.gameLogoArtwork} />
            </MovableItem>}
            <MovableItem editMode={layoutEditMode} label="Move and resize random character portrait" layoutId="character-portrait" style={styles.topCharacterPosition}>
              <View style={styles.goldCharacterRing}>
                <Image source={topCharacter} resizeMode="cover" style={styles.topCharacterPortrait} />
              </View>
            </MovableItem>
            <Pressable accessibilityRole="button" accessibilityLabel={layoutEditMode ? "Lock screen layout" : "Edit screen layout"} onPress={() => setLayoutEditMode(value => !value)} style={styles.layoutModeButton}>
              <Text style={styles.layoutModeButtonText}>{layoutEditMode ? "LOCK LAYOUT" : "EDIT LAYOUT"}</Text>
            </Pressable>
            <Text style={styles.gamePreviewNote}>SCREEN PREVIEW · MULTIPLAYER NOT CONNECTED</Text>
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
  gamePreviewRoot:{...StyleSheet.absoluteFillObject,alignItems:'center',justifyContent:'space-between',paddingTop:Platform.OS==='web'?16:28,paddingBottom:12,paddingHorizontal:10,backgroundColor:'rgba(4,10,25,0.10)'},
  gameLogoPosition:{position:'absolute',left:'2%',top:'2%',width:'25%',height:'10%',zIndex:15},
  gameLogoArtwork:{width:'100%',height:'100%'},
  topCharacterPosition:{position:'absolute',left:'39%',top:'1%',width:74,height:90,zIndex:16,alignItems:'center',justifyContent:'center'},
  goldCharacterRing:{width:'100%',height:'100%',borderRadius:48,borderWidth:4,borderColor:'#F4CE59',backgroundColor:'#10234F',padding:4,alignItems:'center',justifyContent:'center',overflow:'hidden',shadowColor:'#000',shadowOpacity:0.6,shadowRadius:5,elevation:7},
  topCharacterPortrait:{width:'100%',height:'100%',borderRadius:40},
  layoutModeButton:{position:'absolute',right:8,top:8,zIndex:50,paddingHorizontal:10,paddingVertical:7,borderRadius:8,borderWidth:2,borderColor:'#F4CE59',backgroundColor:'#10234F'},
  layoutModeButtonText:{color:'#FFF2B5',fontSize:10,fontWeight:'900'},
  layoutItemControls:{position:'absolute',right:0,top:0,zIndex:60,flexDirection:'row',gap:3},
  layoutItemButton:{width:25,height:25,alignItems:'center',justifyContent:'center',borderRadius:13,borderWidth:1,borderColor:'#F4CE59',backgroundColor:'#10234F'},
  layoutItemButtonText:{color:'#FFFFFF',fontSize:18,fontWeight:'900'},
  gameTopBar:{width:'100%',flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',minHeight:'12%'},
  gamePlayerControls:{position:'absolute',right:0,top:38,width:'30%',height:64},
  gameLobbyButton:{position:'absolute',left:0,top:0,width:100,height:42,zIndex:20},
  
  playerDropdownTapTarget:{...StyleSheet.absoluteFillObject,backgroundColor:'transparent'},
  discardTopCard:{position:'absolute',left:'48%',top:'0%',width:'35.19%',height:'70.38%'},
  gameBackButton:{paddingHorizontal:12,paddingVertical:8,borderRadius:10,borderWidth:1,borderColor:'#D5B56D',backgroundColor:'rgba(8,20,40,0.85)'},
  gameBackText:{color:'#FFE5A0',fontSize:12,fontWeight:'900'},
  playersDropdownArtwork:{width:'100%',height:'100%'},
  playerDropdownButton:{width:'100%',height:'100%',justifyContent:'center'},
  playerDropdownName:{position:'absolute',left:'8%',right:'22%',textAlign:'center',color:'#FFF2B5',fontWeight:'900',fontSize:11,textShadowColor:'#000',textShadowRadius:3},
  playerDropdownMenu:{position:'absolute',top:'100%',right:0,width:150,height:297,backgroundColor:'#101B40',borderColor:'#F4CE59',borderWidth:2,borderRadius:8,zIndex:100,elevation:20},
  playerDropdownOption:{paddingVertical:8,paddingHorizontal:10,borderBottomWidth:1,borderBottomColor:'#38456A'},
  playerDropdownOptionText:{color:'#FFFFFF',fontSize:12,fontWeight:'700'},
  gameDeckArea:{width:'100%',flex:1,alignItems:'center',justifyContent:'center',paddingVertical:4},
  gameDeckTouch:{width:'100%',maxWidth:390,height:'38%',alignItems:'center',justifyContent:'center'},
  gameDecksArtwork:{width:'100%',height:'100%'},
  gameDeckLabels:{color:'#FFF0C3',fontWeight:'900',fontSize:10,textAlign:'center',letterSpacing:1,marginTop:2,textShadowColor:'#000',textShadowRadius:4},
  gameDeckCount:{color:'#FFFFFF',fontWeight:'800',fontSize:9,marginTop:3,textShadowColor:'#000',textShadowRadius:4},
  gameBottomButtons:{width:'100%',maxWidth:760,flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',gap:4,minHeight:76,maxHeight:112},
  gameActionButton:{flex:1,height:96,minWidth:44,alignItems:'center',justifyContent:'center',overflow:'visible'},
  gameActionArtwork:{width:'100%',height:96,minWidth:44},
  discardTopCardMovable:{position:'absolute',left:'48%',top:'0%',width:'35.19%',height:'70.38%',zIndex:30},
  discardTopCardArtwork:{width:'100%',height:'100%'},
  playerHandFan:{position:'absolute',left:'17%',bottom:'7%',width:'66%',height:'23%',zIndex:10},
  playerHandFanInner:{width:'100%',height:'100%'},
  playerHandCardTouch:{position:'absolute',bottom:0,width:'22%',height:'88%'},
  playerHandCard:{width:'100%',height:'100%',borderRadius:5},
  handZoomControls:{position:'absolute',right:0,bottom:0,flexDirection:'row',gap:5,zIndex:30},
  handZoomButton:{width:26,height:26,borderRadius:13,backgroundColor:'#10205D',borderWidth:2,borderColor:'#F4CF58',alignItems:'center',justifyContent:'center'},
  handZoomText:{color:'#FFFFFF',fontSize:19,fontWeight:'900',lineHeight:22},
  gamePreviewNote:{color:'#F8DFA2',fontSize:8,fontWeight:'800',textAlign:'center',marginTop:4,letterSpacing:1,textShadowColor:'#000',textShadowRadius:3},
  lobbyHotspot:{position:'absolute',backgroundColor:'transparent'},
  lobbyPortraitSlot:{position:'absolute',alignItems:'center',justifyContent:'center',overflow:'hidden',borderRadius:10,padding:0,backgroundColor:'transparent'},
  lobbyPortraitImage:{width:'100%',height:'100%',alignSelf:'center',flexShrink:0},
  lobbyPortraitSelected:{borderColor:'#FFF2A2',borderWidth:2,backgroundColor:'rgba(255,211,77,0.18)'},
  lobbyPortraitTaken:{opacity:0.35},
  rosterPanel:{position:'absolute',zIndex:8,left:'66.3%',top:'29.7%',width:'25.2%',height:'50.5%',paddingVertical:'1.2%',paddingHorizontal:'1.1%',display:'flex',flexDirection:'column',gap:3,backgroundColor:'rgba(5,17,38,0.97)',borderColor:'#D9A936',borderWidth:2,borderRadius:9,shadowColor:'#000',shadowOpacity:0.65,shadowRadius:8,elevation:8},
  rosterTitle:{height:'5%',textAlign:'center',textAlignVertical:'center',color:'#FFDC55',fontWeight:'900',fontSize:10,lineHeight:14},
  rosterRow:{minHeight:0,flex:1,flexDirection:'row',alignItems:'center',gap:3,paddingHorizontal:3,borderWidth:1,borderColor:'#21496D',borderRadius:6,backgroundColor:'#0A203A',overflow:'hidden'},
  rosterEmptyRow:{backgroundColor:'rgba(6,22,42,0.7)',borderColor:'#34465D'},
  rosterRank:{width:'7%',flexShrink:0,alignItems:'center',justifyContent:'center'},
  rosterRankText:{textAlign:'center',color:'#FFD65B',fontWeight:'900',fontSize:10},
  hostCrown:{textAlign:'center',color:'#FFDA55',fontSize:16,fontWeight:'900'},
  rosterAvatar:{width:'18%',height:'86%',flexShrink:0,aspectRatio:1,borderRadius:50,borderWidth:1,borderColor:'#D8AD42',backgroundColor:'#071326'},
  rosterAvatarEmpty:{width:'18%',height:'86%',flexShrink:0,aspectRatio:1,borderRadius:50,borderWidth:1,borderStyle:'dashed',borderColor:'#65748A',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(7,19,38,0.8)'},
  rosterEmptyNumber:{color:'#71839A',fontSize:9,fontWeight:'800'},
  rosterWaitingName:{color:'#8290A3',fontWeight:'600'},
  rosterWaitingStatus:{color:'#66778B'},
  rosterCopy:{minWidth:0,flex:1,justifyContent:'center',gap:2},
  rosterName:{color:'#FFFFFF',fontSize:9,fontWeight:'800',lineHeight:13},
  rosterStatus:{color:'#19E987',fontSize:7,fontWeight:'800',lineHeight:11},
  roomCountBadge:{position:'absolute',zIndex:9,left:'59%',top:'19.3%',width:'25%',height:'7.8%',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(6,21,42,0.98)',borderLeftWidth:1,borderRightWidth:1,borderColor:'#D4A83E'},
  roomCountText:{color:'#FFFFFF',fontSize:12,fontWeight:'900',lineHeight:18},
  roomCountSubtext:{color:'#FFDC55',fontSize:8,fontWeight:'900',lineHeight:12},
  joinDialogOverlay:{...StyleSheet.absoluteFillObject,zIndex:20,alignItems:'center',justifyContent:'center',padding:'8%'},
  joinDialogBackdrop:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.68)'},
  joinDialog:{width:'92%',maxWidth:620,aspectRatio:1.5,alignSelf:'center',justifyContent:'center'},
  joinPanelArtwork:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%'},
  joinNameInput:{position:'absolute',left:'10%',top:'53%',width:'80%',height:'15%',paddingHorizontal:14,paddingVertical:4,borderRadius:12,borderWidth:0,backgroundColor:'transparent',color:'#17243B',fontSize:18},
  joinCancelButton:{position:'absolute',left:'12%',top:'72%',width:'35%',height:'17%',backgroundColor:'transparent'},
  joinSaveButton:{position:'absolute',left:'53%',top:'72%',width:'35%',height:'17%',backgroundColor:'transparent'},
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