import {useStyles, createStyleSheet} from 'styles';
import {View, Text} from 'react-native';
// import {Rectangle1} from 'components/page-1/base/rectangle-1';

export interface Component1Props {
  /** Used to locate this view in end-to-end tests. */
  testID?: string,
}

export function Component1(props: Component1Props) {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.root} testID={props.testID ?? "16:4"}>
      <Rectangle1 testID="16:3"/>
      <Text style={styles.asdf} testID="5:5">
        {`asdf`}
      </Text>
      <View style={styles.rectangle2} testID="5:6"/>
      <Text style={styles.$45} testID="7:6">
        {`45`}
      </Text>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  root: {
    width: 154,
    height: 79,
  },
  asdf: {
    width: 79,
    height: 27,
    flexShrink: 0,
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  rectangle2: {
    width: 92,
    height: 3,
    flexShrink: 0,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    backgroundColor: 'rgba(132, 132, 132, 1)',
  },
  $45: {
    width: 10,
    height: 8,
    flexShrink: 0,
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Inria Sans',
    fontSize: 8,
    fontStyle: 'normal',
    fontWeight: '400',
  },
}));
