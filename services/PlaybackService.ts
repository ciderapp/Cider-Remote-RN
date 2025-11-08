import { IOState } from '@/lib/io';
import { nextTrack, pauseAudio, playPause, previousTrack, UpdateNotification } from '@/lib/playback-control';
import TrackPlayer, { Event } from '@weights-ai/react-native-track-player';

export const PlaybackService = async function() {

    TrackPlayer.addEventListener(Event.RemotePlay, () => {playPause(); UpdateNotification(null, IOState.store.get(IOState.isCasting))});

    TrackPlayer.addEventListener(Event.RemotePause, () => {playPause(); UpdateNotification(null, IOState.store.get(IOState.isCasting))});

    TrackPlayer.addEventListener(Event.RemoteNext, () => {nextTrack(); UpdateNotification(null, IOState.store.get(IOState.isCasting))});

    TrackPlayer.addEventListener(Event.RemotePrevious, () => {previousTrack(); UpdateNotification(null, IOState.store.get(IOState.isCasting))});

    TrackPlayer.addEventListener(Event.RemoteStop, () => {pauseAudio(); UpdateNotification(null, IOState.store.get(IOState.isCasting))});

};