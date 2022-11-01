import * as React from 'react';
import {
  Linking,
  SafeAreaView,
  ScrollView,
  Alert,
  Button,
  Text,
} from 'react-native';
import Provider from '@datasign/siop';
import {ec as EC} from 'elliptic';
import {RootNavigationStack} from './src/RootNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {getCredential, verifyAndSaveVP} from './src/utils/credential';
import {getResolver} from './src/utils/resolver';
// @ts-expect-error
import {PRIVATE_KEY, ADDRESS} from '@env';

interface Props
  extends NativeStackScreenProps<RootNavigationStack, 'RequestHandler'> {}

class VerificationError extends Error {}

enum RenderState {
  verifyingSIOPRequest,
  verifyingCredential,
  credentialVerificationDone,
}

const RequestHandler = ({route}: Props) => {
  const curve = 'secp256k1';
  const [renderState, setRenderState] = React.useState<RenderState>(
    RenderState.verifyingSIOPRequest,
  );
  const [error, setError] = React.useState<string>();
  const [data, setData] = React.useState<string>();
  const [requestReceived, setRequestReceived] = React.useState<boolean>(false);
  const [location, setLocation] = React.useState<string>('');
  const [request, setRequest] = React.useState<any>();

  React.useEffect(() => {
    const ec = new EC(curve);
    const keyPair = ec.keyFromPrivate(PRIVATE_KEY);
    const did = `did:ethr:${ADDRESS}`;
    const idTokenExpiresIn = 3600;

    const resolver = getResolver();

    (async () => {
      if (route.params) {
        if (route.params.vpToken) {
          setRenderState(RenderState.verifyingCredential);
          try {
            const vpToken = route.params.vpToken;
            await verifyAndSaveVP(vpToken);
            return;
          } catch (e) {
            throw new VerificationError(
              'failed to verify (or save) credentials',
            );
          } finally {
            setRenderState(RenderState.credentialVerificationDone);
          }
        } else if (route.params.scope) {
          console.log(JSON.stringify(route.params, null, 2));
          // handle sign-in request
          const provider = new Provider(idTokenExpiresIn, resolver);
          try {
            setRenderState(RenderState.verifyingSIOPRequest);
            await provider.receiveRequest(route.params);
            setRequest(route.params);
            setRequestReceived(true);

            const redirect = await provider.generateResponse(did, keyPair);
            const vpToSend = await getCredential();

            setLocation(`${redirect}&vp_token=${vpToSend}`);
          } catch (siopError: any) {
            setError(
              siopError.message +
                '\n' +
                siopError.invalidField +
                '\n' +
                siopError.invalidValue,
            );
          }
        }
      }
    })();
  }, [route.params]);

  React.useEffect(() => {
    if (requestReceived && location && request) {
      console.log(location);
      Alert.alert(
        'Continue Sign-in?',
        `We received a valid SIOP request: \n\n${JSON.stringify(
          request,
          null,
          2,
        )}`,
        [
          {
            text: 'Cancel',
            onPress: () => {
              console.log('Cancel Pressed');
            },
            style: 'cancel',
          },
          {
            text: 'Comfirm Sign-in',
            onPress: async () => {
              await Linking.openURL(location);
            },
          },
        ],
      );
    } else if (error) {
      Alert.alert('Sign-in Failure', error);
    }
  }, [requestReceived, location, request, error]);

  const showData = async () => {
    const d = await getCredential();
    setData(d);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Button onPress={showData} title={'show data'} />
        <Text>{data}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RequestHandler;
