import { changeToIndex, fetchQueue, queueItems, removeByIndex, setQueue as setQueueApi } from "@/lib/queue";
import { QueueItem } from "@/types/musickit";
import { useIsFocused } from "@react-navigation/native";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Button, Dialog, IconButton, List, Portal, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from 'react-native-safe-area-context';
import DraggableFlatList, {
  DragEndParams,
  RenderItemParams,
} from "react-native-draggable-flatlist";

export default function Queue() {
  const isFocused = useIsFocused();
  const [queue, setQueue] = useAtom(queueItems);
  const theme = useTheme();

  useEffect(() => {
    if (isFocused) {
      fetchQueue();
    }
  }, [isFocused]);

  const onDragEnd = (params: DragEndParams<QueueItem>) => {
    setQueue(params.data);
    const newQueueIds = params.data.map(item => item.id);
    setQueueApi(newQueueIds);
  };

  if (!isFocused) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <DraggableFlatList
        data={queue}
        onDragEnd={onDragEnd}
        keyExtractor={(item) => item.id}
        renderItem={UIQueueItem}
        ListHeaderComponent={() => (
          <Text variant="headlineSmall" style={styles.header}>
            Up Next
          </Text>
        )}
      />
    </SafeAreaView>
  );
}

function UIQueueItem({ item, drag, isActive }: RenderItemParams<QueueItem>) {
  const [showActions, setShowActions] = useState(false);
  const theme = useTheme();
  const [queue] = useAtom(queueItems);
  const idx = queue.findIndex(i => i.id === item.id);

  const artworkUri = useMemo(() => {
    return item.attributes.artwork?.url
      .replace("{h}", "60")
      .replace("{w}", "60");
  }, [item]);

  return (
    <>
      <View style={[
        styles.listItemContainer,
        isActive && styles.dragging,
        { backgroundColor: isActive ? theme.colors.surfaceVariant : theme.colors.background }
      ]}>
        <TouchableOpacity onLongPress={drag} style={styles.dragHandle}>
          <IconButton icon="drag-horizontal-variant" />
        </TouchableOpacity>
        <List.Item
          title={item.attributes.name ?? "Untitled"}
          description={item.attributes.artistName ?? ""}
          onPress={() => changeToIndex(idx)}
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
            <IconButton icon="menu" onPress={() => setShowActions(true)} {...props} />
          )}
          titleStyle={styles.title}
          descriptionStyle={[styles.description, { color: theme.colors.onSurfaceVariant }]}
          style={styles.listItem}
        />
      </View>

      <Portal>
        <Dialog visible={showActions} onDismiss={() => setShowActions(false)}>
          <Dialog.Title>
            {item.attributes.name ?? "Untitled"}
          </Dialog.Title>
          <Dialog.Content>
            <Button
              icon="close"
              onPress={() => {
                removeByIndex(idx);
                setShowActions(false);
              }}>Remove From Queue</Button>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowActions(false)}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    marginVertical: 16,
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
