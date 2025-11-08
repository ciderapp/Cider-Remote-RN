import { PlaybackService } from "@/services/PlaybackService";
import TrackPlayer from "@weights-ai/react-native-track-player";
import 'expo-router/entry';

TrackPlayer.registerPlaybackService(() => PlaybackService);

