import { changeToIndex, fetchQueue, modifiedQueueItems, moveToPosition, queueItems, removeByIndex } from "@/lib/queue";
import { QueueItem } from "@/types/musickit";
import { useIsFocused } from "@react-navigation/native";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { Animated, FlatList, StyleSheet, View } from "react-native";
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Button, Dialog, IconButton, List, Portal, useTheme } from "react-native-paper";

export default function Queue() {
  const isFocused = useIsFocused();
  const [queue, setQueue] = useAtom(modifiedQueueItems);
  const theme = useTheme();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isFocused) {
      fetchQueue();
    }
  }, [isFocused]);

  if (!isFocused) {
    return null;
  }

  return (
      <View style={{ flex: 1, zIndex: 2 }}>
        <FlatList
          data={queue}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item, index }) => (
            <UIQueueItem
              item={item}
              idx={index}
              isDragged={draggedIndex === index}
              onDragStart={() => setDraggedIndex(index)}
              onDragEnd={() => setDraggedIndex(null)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 32 }}
          initialNumToRender={10}
          windowSize={5}
          getItemLayout={(_, index) => ({
            length: 80,
            offset: 80 * index,
            index,
          })}
        />
      </View>
  );
}

type UIQueueItemProps = {
  item: QueueItem;
  idx: number;
  isDragged?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

export function UIQueueItem({ item, idx, isDragged, onDragStart, onDragEnd }: UIQueueItemProps) {
  const [queue, setQueue] = useAtom(queueItems);
  const [showActions, setShowActions] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const theme = useTheme();
  const translateY = new Animated.Value(0);
  const scale = new Animated.Value(1);

  const artworkUri = useMemo(() => {
    return item.attributes.artwork?.url
      .replace("{h}", "60")
      .replace("{w}", "60");
  }, [item]);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setIsDragging(true);
      onDragStart?.();
      Animated.spring(scale, {
        toValue: 1.05,
        useNativeDriver: true,
      }).start();
  } else if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
      const { translationY } = event.nativeEvent;
      const itemHeight = 80;
      const moveDistance = Math.round(translationY / itemHeight);
      const originalIdx = item.originalIndex;
      const newOriginalIndex =
        originalIdx !== undefined
          ? Math.max(0, Math.min(originalIdx + moveDistance, queue.length - 1))
          : undefined;

      if (
        newOriginalIndex !== undefined &&
        originalIdx !== undefined &&
        newOriginalIndex !== originalIdx &&
        event.nativeEvent.state === State.END
      ) {
        moveToPosition(originalIdx, newOriginalIndex);
      }

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        setIsDragging(false);
      }, 100);

      onDragEnd?.();
    }
  };

  return (
    <>
      <Animated.View
        style={[
          {
            transform: [{ translateY }, { scale }],
            zIndex: isDragged ? 1000 : 1,
            elevation: isDragged ? 8 : 0,
          },
          isDragged && styles.dragging,
        ]}
      >
        <List.Item
          title={item.attributes.name ?? "Untitled"}
          description={item.attributes.artistName ?? ""}
          onPress={() => {
            changeToIndex(item.originalIndex ?? idx);
          }}
          left={(props) =>
            item.attributes.artwork?.url ? (
              <List.Image
                {...props}
                source={{ uri: artworkUri }}
                style={styles.artwork}
              />
            ) : (
              <List.Icon {...props} icon="music" style={styles.artwork} />
            )
          }
          right={(props) => (
            <PanGestureHandler
              onGestureEvent={onGestureEvent}
              onHandlerStateChange={onHandlerStateChange}
            >
              <Animated.View>
                <IconButton
                  icon="menu"
                  onPress={() => setShowActions(true)}
                  {...props}
                  style={styles.dragHandle}
                />
              </Animated.View>
            </PanGestureHandler>
          )}
          titleStyle={styles.title}
          descriptionStyle={[styles.description, { color: theme.colors.onSurfaceVariant }]}
          style={[
            styles.listItem,
            isDragged && { backgroundColor: theme.colors.surfaceVariant }
          ]}
        />
      </Animated.View>

      <View>
        <Portal>
          <Dialog visible={showActions} onDismiss={() => setShowActions(false)}>
            <Dialog.Title>
              {item.attributes.name ?? "Untitled"}
            </Dialog.Title>
            <Dialog.Content>
              <Button
                icon="close"
                onPress={() => {
                  removeByIndex(item.originalIndex ?? idx);
                  setShowActions(false);
                }}>Remove From Queue</Button>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowActions(false)}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    fontWeight: '600',
  },
  listItem: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  artwork: {
    borderRadius: 8,
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
  },
  dragging: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  dragHandle: {
    opacity: 0.5,
  },
});
