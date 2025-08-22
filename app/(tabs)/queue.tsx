import { changeToIndex, fetchQueue, queueItems, removeByIndex } from "@/lib/queue";
import { QueueItem } from "@/types/musickit";
import { useIsFocused } from "@react-navigation/native";
import { useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Dialog, List, Portal, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Queue() {
  const isFocused = useIsFocused();

  const queue = useAtomValue(queueItems);
  const theme = useTheme();

  function UIQueueView() {
    return (
      <View>
        <Text variant="headlineSmall" style={styles.header}>
          Up Next
        </Text>
        {queue.map((item, idx) => (
          <UIQueueItem key={idx} item={item} idx={idx} />
        ))}
      </View>
    )
  }

  useEffect(() => {
    if (isFocused) {
      fetchQueue();
    }
  }, [isFocused])

  if (!isFocused) {
    return null;
  }
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView>
        {isFocused && <UIQueueView />}
      </SafeAreaView>
    </ScrollView>
  );
}



type UIQueueItemProps = {
  item: QueueItem;
  idx: number;
};

function UIQueueItem({ item, idx }: UIQueueItemProps) {
  const [showActions, setShowActions] = useState(false);
  const theme = useTheme();
  const artworkUri = useMemo(() => {
    return item.attributes.artwork?.url
      .replace("{h}", "60")
      .replace("{w}", "60");
  }, [item]);

  return (
    <>
      <List.Item
        title={item.attributes.name ?? "Untitled"}
        description={item.attributes.artistName ?? ""}
        onPress={() => {
          changeToIndex(idx);
        }}
        onLongPress={() => {
          setShowActions(true);
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
        titleStyle={styles.title}
        descriptionStyle={[styles.description, { color: theme.colors.onSurfaceVariant }]}
        style={styles.listItem}
      />

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
                  removeByIndex(idx);
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
});
