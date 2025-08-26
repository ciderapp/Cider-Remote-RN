import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";

type HeaderProps = {
    backButton?: boolean;
    backButtonHandler?: () => void;
    title?: string;
}


export function Header(props: HeaderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        height: 64,
      }}
    >
      {props.backButton && (
        <IconButton
          icon="arrow-left"
          onPress={props.backButtonHandler}
          style={{ position: "absolute", left: 0, zIndex: 1 }}
        />
      )}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text
          style={{
            fontWeight: "bold",
            textAlign: "center",
          }}
          variant="titleLarge"
        >
          {props.title}
        </Text>
      </View>
    </View>
  );
}
