import { AppRegistry } from 'react-native';
import ReactApp from './index';
import emdigital from './js/app';
import OneSignal from 'react-native-onesignal';
import store from 'react-native-simple-store';
OneSignal.addEventListener('opened', async (values)=>{    
    if(values.notification.payload.additionalData.newsid){
        await store.save('deepLinkNewsId',values.notification.payload.additionalData.newsid);
    }
    
});
  
AppRegistry.registerComponent('emdigital', () => emdigital);
