<template>
  <div id="app" class="resizable">
    <div class="head no-select">
      <div>
        <span>简易采集时钟</span>
        <span class="time">ET {{ ET }}</span>
        <span class="time">LT {{ LT }}</span>
        <span class="btn" @click="showSetting = true">[选择]</span>
      </div>
    </div>
    <div class="content">
      <div class="items">
        <div class="item" :class="it.cur ? 'active' : 'next'" v-for="(it, key) in works" :key="key">
          <item :item="it" :hour="rtEpoch.hour" :sec="rtEpoch.Rsec" :progress="it.percent" />
        </div>
      </div>
    </div>
    <div class="setting no-select" v-show="showSetting">
      <div class="close btn" @click="showSetting = false">[X]</div>
      <div class="checkbox-group">
        <div class="checkbox" v-for="(v, k) in showItem" :key="k">
          <input type="checkbox" v-model="showItem[k]" :id="k" />
          <label :for="k">{{ k }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { calcTime, getNextTime, outTimeSec } from './lib/dtEorzea';
import item from './components/item.vue';
import itemsOrig from './data/item.json';

function padTime(time) {
  return time < 10 ? `0${time}` : `${time}`;
}

const nameList = {};
const storage = JSON.parse(localStorage.getItem('show') || '{}');
itemsOrig.forEach(({ name }) => {
  nameList[name] = name in storage ? storage[name] : true;
});

export default {
  name: 'App',
  components: { item },
  data() {
    const items = [];
    itemsOrig.forEach(item => {
      item.start.forEach(s => {
        items.push({
          ...item,
          start: `${padTime(s)}:00`,
          end: `${padTime(s + (item.start.length > 1 ? 2 : 4))}:00`,
          duration: (item.start.length > 1 ? 2 : 4) * (70 / 1440) * 3600,
        });
      });
    });
    return {
      rtEpoch: { hour: 0, min: 0, sec: 0, Rhour: 0, Rmin: 0, Rsec: 0, time: 0 },
      items,
      works: [],
      showItem: nameList,
      showSetting: false,
    };
  },
  computed: {
    ET() {
      return [this.rtEpoch.hour, this.rtEpoch.min, this.rtEpoch.sec].map(v => padTime(v)).join(':');
    },
    LT() {
      return [this.rtEpoch.Rhour, this.rtEpoch.Rmin, this.rtEpoch.Rsec].map(v => padTime(v)).join(':');
    },
  },
  watch: {
    showItem: {
      handler(val) {
        localStorage.setItem('show', JSON.stringify(val));
      },
      deep: true,
    },
    'rtEpoch.sec'() {
      const out = [];
      const curTime = this.rtEpoch.time / 1000;
      // console.log('rtEpoch.min', this.rtEpoch.hour, this.rtEpoch.min)

      this.items
        .filter(({ name }) => this.showItem[name])
        .forEach(item => {
          const startTime = getNextTime(item.start, this.rtEpoch);
          const endTime = getNextTime(item.end, this.rtEpoch);

          item.endTimeStr = outTimeSec(endTime);
          item.startTimeStr = outTimeSec(startTime);
          item.st = startTime.getTime() / 1000;
          item.et = endTime.getTime() / 1000;
          item.endTimeLimit = item.et - curTime; //  LimitTime(endTime, this.rtEpoch)
          item.startTimeLimit = item.st - curTime; // LimitTime(startTime, this.rtEpoch)
          item.percent = 0;

          const realST = item.et - item.duration;
          if (realST <= curTime && curTime < item.et) {
            item.cur = true;
            item.percent = ((curTime - realST) / (item.et - realST)) * 100;
            // out.push(item);
          } else {
            item.cur = false;
          }
          out.push(item);
        });

      out.sort((it1, it2) => {
        if (it1.cur && !it2.cur) return -1;
        if (!it1.cur && it2.cur) return 1;
        return it1.et - it2.et;
      });

      this.works = out;
    },
  },
  methods: {
    getTime() {
      const time = calcTime();
      this.rtEpoch.hour = time.hour;
      this.rtEpoch.min = time.min;
      this.rtEpoch.sec = time.sec;
      this.rtEpoch.Rhour = time.Rhour;
      this.rtEpoch.Rmin = time.Rmin;
      this.rtEpoch.Rsec = time.Rsec;
      this.rtEpoch.time = time.time;
    },
  },
  created() {
    this.getTime();
    setInterval(() => {
      this.getTime();
    }, 1000);
  },
};
</script>

<style lang="less">
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
body {
  background-color: transparent;
  background-image: url(./assets/handle.png);
  background-position: bottom right;
  background-repeat: no-repeat;
  background-size: 12px;
}
.btn {
  cursor: pointer;
}
.no-select {
  user-select: none;
}
#app {
  font-family: '方正准圆', '微软雅黑', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  text-shadow: 0 0 0.125em rgba(0, 0, 0, 0.4);
  .head {
    display: block;
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    color: white;
    text-align: left;
    padding: 0 26px 0 10px;
    font-weight: bold;
    div {
      background-color: rgba(244, 67, 54, 0.8);
      padding-left: 16px;
      width: 100%;
      transform: skewX(-30deg);
      span {
        display: inline-block;
        margin-right: 16px;
        transform: skewX(30deg);
      }
    }
  }
  .content {
    display: block;
    font-size: 14px;
    min-height: 100px;
    color: white;
    text-align: left;
    padding: 8px 18px 0 18px;
    .items {
      width: 100%;
      height: 100%;
    }
    .item {
      margin-bottom: 4px;
      font-weight: bold;
    }
    .active {
      .item-list {
        background-color: rgba(76, 175, 80, 0.85);
      }
    }
    .next {
      .item-list {
        background-color: rgba(3, 115, 229, 0.7);
      }
    }
  }
  .setting {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    line-height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    .close {
      position: absolute;
      right: 8px;
      top: 8px;
    }
    .checkbox-group {
      margin-right: -24px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      .checkbox {
        display: flex;
        margin-right: 16px;
        margin-bottom: 8px;
        input {
          display: inline-block;
          width: 14px;
          height: 14px;
          margin: 0;
        }
        label {
          display: inline-block;
          width: 115px;
          text-align: left;
          margin-left: 4px;
          font-size: 14px;
          line-height: 14px;
        }
      }
    }
  }
}
</style>
