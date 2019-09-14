var area_list = new Vue({
  el: '#area_list',
  data: {
    area_list: null,
    filtered_area_list: null,
    modal_opened: false,
    selected_area_data: null,
    input_area_name: ''
  },
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
    },
    search_by_gps() {
      if (!navigator.geolocation) {
        alert('お使いの端末では位置情報が取得できません');
        return;
      }
      // 現在地を取得
      navigator.geolocation.getCurrentPosition(
        (position) => {
          var request_setting = {
            params: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          };
          axios.get('https://m9th3qj7ig.execute-api.ap-northeast-1.amazonaws.com/production/get', request_setting).then(
            (response) => {
              var condition_list = JSON.parse(response.data.body);
              console.log(condition_list);
              // 複数条件で絞り込む
              this.filtered_area_list = this.area_list.filter((area_data) => {
                for (var index = 0; index < condition_list.length; index++) {
                  if (area_data.area_name.indexOf(condition_list[index]) != -1) {
                    return true;
                  }
                }
                return false;
              });
            }
          );
        },
        (error) => {
          (error.code == 1) ? alert('位置情報の利用が許可されていません') : alert('位置情報が取得できませんでした');
        }
      );
    }
  }
});
