var area_list = new Vue({
  el: '#area_list',
  data: {
    area_list: null,
    filtered_area_list: null,
    modal_opened: false,
    selected_area_data: null,
    input_area_name: '',
    area_name_conditions: null
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
              latlng: `${position.coords.latitude},${position.coords.longitude}`,
              key: 'AIzaSyDB2ycApLRLUjpzPl9k2LuKx5dPoQU4u1E'
            }
          };
          axios.get('https://maps.googleapis.com/maps/api/geocode/json', request_setting).then(
            (response) => {
              var get_generic_name_list = [];

              response.data.results.forEach((result) => {
                result.address_components.forEach((address_component) => {
                  get_generic_name_list.push(address_component.long_name);
                });
              });

              // 重複を削除する
              this.area_name_conditions = get_generic_name_list.filter((element, index, self) => {
                return self.indexOf(element) === index;
              });

              // 複数条件で絞り込む
              this.filtered_area_list = this.area_list.filter((area_data) => {
                for (var index = 0; index < this.area_name_conditions.length; index++) {
                  if (area_data.area_name.indexOf(this.area_name_conditions[index]) != -1) {
                    return true;
                  }
                }
                return false;
              });

            }
          );
        },
        (error) => {
          (error.code == 1) ? alert('位置情報の利用が許可されていません'): alert('位置情報が取得できませんでした');
        }
      );
    }
  }
});
