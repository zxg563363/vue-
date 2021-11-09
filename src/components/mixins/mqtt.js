/**
 * Created by lixiansky on 2021/8/30
 */
import mqtt from 'mqtt';
const mqttOptions = {
  // 超时时间
  // connectTimeout: 4000,
  // 认证信息
  // clientId: 'emqx',
  // 心跳时间
  keepalive: 60,
  clean: true,
};
const MQTT = {
  data() {
    return {
      mqttClient: null,
      mqttData: {},
    }
  },
  methods: {
    // 退订主题
    unsubscribeMQTT(topic){
      this.mqttClient && (this.mqttClient.unsubscribe('coal/web/collector/real/'+topic,{},(error)=>{
        console.debug(error ||'消息主题退订成功！');
      }));
    },
    subscribeMQTT(client, topic){
      client && client.subscribe('coal/web/collector/real/'+topic,{},(error)=>{
        // console.error(error);
        console.debug(error || `【${topic}】实时数据消息主题订阅成功！`);
      });
    },
    handleMQTT(client,topic){
      client.on('connect',(res)=>{
        // console.debug('消息服务连接成功！',res);
        topic && this.subscribeMQTT(client, topic);
      });


      client.on('message',(topic, message)=>{
        // console.log('收到来自', topic,'的消息:', message.toString());
        let data = null;
        try {
          data = JSON.parse(message.toString());
        }catch (e) {
          data = {
            title: '成功',
            content: '消息提醒！'
          };
        }
        // console.log(topic,data);
        this.mqttData = data;
      });

      client.on('error',(error)=>{
        console.error(error);
      });
      client.on('offline',()=>{
        console.error('offline');
      });

      client.on('reconnect',()=>{
        console.error('reconnect');
      });
    },
    connectMQTT(){
      return this.mqttClient ? this.mqttClient : mqtt.connect('ws://120.133.52.104:8083/mqtt', mqttOptions);
    },
  },

  destroyed(){
    // 断开连接
    this.mqttClient.end();
    this.mqttClient = null;
  },

};
export {MQTT};
