<template>
<v-app>
  <div>
    <v-app-bar color="green darken-4" dark>
      山形市 地区別ごみ収集曜日一覧
    </v-app-bar>
  </div>
  <v-container>
    <div>
      <v-row>
        <v-col cols="8" md="4" class="pl-6">
          <v-text-field v-model="input_area_name" @keyup="search" label="地名を入力"></v-text-field>
        </v-col>
        <v-col cols="4" class="pt-6">
          <v-btn @click="search">検索</v-btn>
        </v-col>
      </v-row>
    </div>
    <div>
      <span v-for="area_data in filtered_area_list">
        <v-btn @click="select(area_data)" class="underline" color="blue accent-4" text>
          {{ area_data.area_name }}
        </v-btn>
      </span>
    </div>
  </v-container>
  <transition name="slide">
    <v-card id="modal-window" v-show="modal_opened" v-if="selected_area_data">
      <v-card-title>
        {{ selected_area_data.area_name }}
      </v-card-title>
      <v-card-text>
        <ul>
          <li>もやせるごみ：{{ selected_area_data.burnable }}</li>
          <li>ビン・カン：{{ selected_area_data.recyclable }}</li>
          <li>プラスチック：{{ selected_area_data.plastics }}</li>
          <li>ペットボトル：{{ selected_area_data.petbottle }}</li>
          <li>埋立ごみ：{{ selected_area_data.landfill }}</li>
        </ul>
        <p v-if="selected_area_data.remarks">
          備考<br>
          {{ selected_area_data.remarks }}
        </p>
      </v-card-text>
      <v-card-actions class="pl-6">
        <v-btn @click="close">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </transition>
</v-app>
</template>

<script>
import '../plugins/axios'
export default {
  data: () => ({
    area_list: null,
    filtered_area_list: null,
    modal_opened: false,
    selected_area_data: null,
    input_area_name: ''
  }),
  mounted() {
    axios.get('https://script.google.com/macros/s/AKfycbyYMvoHo4may5LlbtEzZ2hRzN1OrAiRcYh59psPxrXLi-WNREgx/exec').then(
      (response) => {
        this.area_list = response.data
        this.filtered_area_list = response.data
      }
    );
  },
  methods: {
    select(area_data) {
      this.modal_opened = true;
      this.selected_area_data = area_data;
    },
    close() {
      this.modal_opened = false;
    },
    search() {
      this.filtered_area_list = this.area_list.filter(area_data => area_data.area_name.indexOf(this.input_area_name) != -1);
    }
  }
};
</script>

<style>
#modal-window {
  position: fixed;
  top: 0;
  left: 0%;
  width: 100%;
  height: 100%;
  margin: auto;
  border: 2px solid gray;
  border-radius: 0;
  opacity: 1;
  padding: 1rem;
}

[v-cloak] {
  display: none;
}

.slide-enter-active {
  animation: show-modal-window 500ms;
}

.slide-leave-active {
  animation: show-modal-window 500ms reverse;
}

.underline {
  text-decoration: underline;
}

@keyframes show-modal-window {
  0% {
    opacity: 0;
    left: 100%;
  }

  100% {
    opacity: 1;
    left: 0%;
  }
}
</style>
