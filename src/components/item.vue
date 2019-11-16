<template>
  <div class="item-list">
    <span class="pos">[{{ item.pos }}]</span>
    <span class="name">{{ item.name }}</span>
    <span class="ls">{{ item.ls }}</span>
    <span> ET.{{ item.start }}</span>
    <span v-if="cur"> 余{{ str }} </span>
    <span v-else>LT.{{ item.startTimeStr }}</span>
  </div>
</template>

<script>
// export const cdn = 'http://cal.ffxiv.xin/';
// export const getImg = function(_iconID, isHq) {
//   const hq = isHq ? 'hq/' : '';
//   let iconID = _iconID + '';
//   if (iconID.length === 5) iconID = '0' + iconID;
//   if (iconID.length === 4) iconID = '00' + iconID;
//   if (iconID.length === 3) iconID = '000' + iconID;
//   if (iconID.length === 2) iconID = '0000' + iconID;
//   if (iconID.length === 1) iconID = '00000' + iconID;
//   return `${cdn}${iconID.substring(0, 3)}000/${hq}${iconID}.png`;
// };

function padTime(time) {
  return time < 10 ? `0${time}` : `${time}`;
}

export default {
  name: 'Item',
  props: {
    item: { type: Object, default: () => {} },
    hour: { type: Number, default: 0 },
    sec: { type: Number, default: 0 },
  },
  data() {
    return {
      cur: false,
      itimg: '',
      italt: '',
      asimg: '',
      asalt: '',
      time: 0,
      str: '',
    };
  },
  watch: {
    sec() {
      this.ready();
    },
  },
  mounted() {
    this.ready();
  },
  methods: {
    ready() {
      this.cur = this.item.cur;
      if (this.cur) {
        const t = this.item.endTimeLimit;
        this.str = t <= 59 ? padTime(Math.floor(t)) + '秒' : padTime(Math.floor(t / 60)) + '分' + padTime(Math.floor(t % 60)) + '秒';
      } else {
        // const t2 = this.item.startTimeLimit
        // this.str = t2 <= 59 ? Math.floor(t2) + '秒' : Math.floor(t2 / 60) + '分' + Math.floor(t2 % 60) + '秒'
      }
    },
  },
};
</script>

<style></style>
