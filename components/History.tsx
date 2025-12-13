import { getQueueHistory } from "@/lib/history";
import { queueItems } from "@/lib/queue";
import { useAtom, useAtomValue } from "jotai";
import { FlatList, View } from "react-native";
import { UIQueueItem } from "./Queue";

export default function History() {
  const history = useAtomValue(getQueueHistory);
  const [queue] = useAtom(queueItems);

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <FlatList
        data={history}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <UIQueueItem
            item={item}
            idx={index}
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
