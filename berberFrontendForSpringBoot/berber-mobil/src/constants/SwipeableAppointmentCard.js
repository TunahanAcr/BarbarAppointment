import React, { useRef, useEffect, useState } from "react";
import { Animated } from "react-native";

export const SwipeableAppointmentCard = ({
  children,
  isRemoving,
  onAnimationComplete,
}) => {
  const animatedOpacity = useRef(new Animated.Value(1)).current;
  const animatedScale = useRef(new Animated.Value(1)).current;
  const animatedHeight = useRef(new Animated.Value(1)).current; // 1 = tam boy
  const [cardHeight, setCardHeight] = useState(0);

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    // Sadece ilk ölçümde set et
    if (cardHeight === 0 && height > 0) {
      setCardHeight(height);
    }
  };

  useEffect(() => {
    console.log("isRemoving:", isRemoving, "cardHeight:", cardHeight);
    if (isRemoving && cardHeight > 0) {
      Animated.parallel([
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: 350,
          useNativeDriver: false,
        }),
      ]).start(() => {
        onAnimationComplete?.();
      });
    }
  }, [isRemoving, cardHeight]);

  // Height interpolation: 1 -> cardHeight, 0 -> 0
  const interpolatedHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, cardHeight > 0 ? cardHeight + 12 : 0], // +12 marginBottom için
  });

  return (
    <Animated.View
      onLayout={onLayout}
      style={{
        opacity: animatedOpacity,
        height: cardHeight > 0 ? interpolatedHeight : undefined, // ✅ Ölçülmeden önce height kısıtlama
        overflow: "hidden",
        transform: [
          {
            translateX: animatedOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
};
