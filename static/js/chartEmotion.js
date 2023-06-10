let last_one_label = new Array(31).fill(0);
let last_two_label = new Array(31).fill(0);
let last_three_label = new Array(31).fill(0);
let last_four_label = new Array(31).fill(0);
let last_five_label = new Array(31).fill(0);

let current_one_label = new Array(31).fill(0);
let current_two_label = new Array(31).fill(0);
let current_three_label = new Array(31).fill(0);
let current_four_label = new Array(31).fill(0);
let current_five_label = new Array(31).fill(0);

let date = new Date();
let current_month = date.getMonth() + 1;
let current_day = date.getDay() + 1;

let user_nickname;

$(document).ready(function () {
  show_last_month();
  show_current_month();
  show_user_name();
});

const myChart1 = new Chart(
  document.getElementById("myChart1").getContext("2d"),
  {
    type: "line",
    data: {},
    options: {
      responsive: true,

      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            stepSize: 1,
          },
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        // 범례 설정
        legend: {
          display: true,
          position: "top",
          align: "end",
          labels: {
            boxWidth: 20, // 범례 아이콘 크기
            font: {
              size: 25, // 범례 폰트 크기
            },
            fontFamily: "Helvetica", // 폰트 스타일
          },
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
        title: {
          display: true,
          text: "지난 달 감정 상태",
        },
      },
      hover: {
        mode: "index",
        intersec: false,
      },
    },
  }
);

const myChart2 = new Chart(document.getElementById("myChart2"), {
  type: "line",
  data: {},
  options: {
    responsive: true,

    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          stepSize: 1,
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true, // 범례 차트에 표시
        position: "top",
        align: "end",
        labels: {
          boxWidth: 20,
          font: {
            size: 25,
          },
          fontFamily: "Helvetica",
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
      title: {
        display: true,
        text: "이번 달 감정 상태",
      },
    },
    hover: {
      mode: "index",
      intersec: false,
    },
  },
});

// 현황판에 보여줄 사용자 이름
function show_user_name() {
  $.ajax({
    type: "GET",
    url: "/get_username",
    data: {},
    success: function (res) {
      let id = res["result"]["id"];
      const notice_user = document.querySelector("#notice_user");
      notice_user.textContent = id + "님은";
    },
  });
}

// 저번 달 감정 상태를 보여주는 차트 기능
function show_last_month() {
  $.ajax({
    type: "GET",
    url: "/show_diary",
    data: { month: current_month - 1 },
    success: function (res) {
      let data = res["result"];

      data.forEach((a) => {
        if (a["month"] === (current_month - 1).toString()) {
          let emoji = a["emoji"];
          let day = a["day"];
          if (a["nickname"]) user_nickname = a["nickname"];

          // 저번달 유저의 감정상태 담기

          if (emoji === "1") {
            last_one_label[day - 1]++;
          }
          if (emoji === "2") {
            last_two_label[day - 1]++;
          }
          if (emoji === "3") {
            last_three_label[day - 1]++;
          }
          if (emoji === "4") {
            last_four_label[day - 1]++;
          }
          if (emoji === "5") {
            last_five_label[day - 1]++;
          }

          let last_one_label_sum = last_one_label.reduce(
            (acc, cur) => acc + cur,
            0
          );
          let last_two_label_sum = last_two_label.reduce(
            (acc, cur) => acc + cur,
            0
          );
          let last_three_label_sum = last_three_label.reduce(
            (acc, cur) => acc + cur,
            0
          );
          let last_four_label_sum = last_four_label.reduce(
            (acc, cur) => acc + cur,
            0
          );
          let last_five_label_sum = last_five_label.reduce(
            (acc, cur) => acc + cur,
            0
          );
          // let six_label_sum = six_label.reduce((acc, cur) => acc + cur, 0);

          const last_label_list = [
            last_one_label,
            last_two_label,
            last_three_label,
            last_four_label,
            last_five_label,
            //   six_label,
          ];

          let last_label_sum_list = [
            last_one_label_sum,
            last_two_label_sum,
            last_three_label_sum,
            last_four_label_sum,
            last_five_label_sum,
            //   six_label_sum,
          ];

          const last_month_maxEmotion_label = Math.max(...last_label_sum_list); // 저번달 가장 많이 느꼈던 감정을 변수에 담았음.

          // 저번달 가장 많은 감정의 인덱스(실제 감정값)
          const last_month_maxEmotion_index = last_label_sum_list.indexOf(
            last_month_maxEmotion_label
          );

          // 저번달 가장 많은 감정의 이름
          const last_month_maxEmotion_name = last_month_maxEmotion_index + 1;

          const last_month_maxEmotion_data = // 저번 달 가장 많은 감정의 데이터를 담은 배열.
            last_label_list[last_month_maxEmotion_index];

          // // 현황판 oo님
          // const notice_user = document.querySelector("#notice_user");
          // notice_user.textContent = user_nickname + "님은";

          const last_month_emotion = document.querySelector(
            "#last_month_emotion"
          );
          last_month_emotion.textContent = `지난달 주요 감정은 ${
            last_month_maxEmotion_name === 1
              ? "홀가분"
              : last_month_maxEmotion_name === 2
              ? "좋음"
              : last_month_maxEmotion_name === 3
              ? "보통"
              : last_month_maxEmotion_name === 4
              ? "언짢음"
              : "화남"
          }입니다.`;
          // last_month_emotion.style.color = "rgb(255, 99, 132)";
          // last_month_emotion.style.fontWeight = "bold";

          const notice_last_month =
            document.querySelector("#notice_last_month");
          notice_last_month.textContent = `지난 달 ${
            last_month_maxEmotion_name === 1
              ? "홀가분"
              : last_month_maxEmotion_name === 2
              ? "좋음"
              : last_month_maxEmotion_name === 3
              ? "보통"
              : last_month_maxEmotion_name === 4
              ? "언짢음"
              : "화남"
          } 을`;

          const labels = new Array(31).fill(0).map((_, i) => i + 1);

          myChart1.data.labels = labels;

          myChart1.data.datasets[0] = {
            label:
              last_month_maxEmotion_name === 1
                ? "홀가분"
                : last_month_maxEmotion_name === 2
                ? "좋음"
                : last_month_maxEmotion_name === 3
                ? "보통"
                : last_month_maxEmotion_name === 4
                ? "언짢음"
                : "화남",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: last_month_maxEmotion_data,
          };

          myChart1.update();
        }
      });
    },
  });
}

// 이번 달 감정 상태를 보여주는 차트 기능
function show_current_month() {
  $.ajax({
    type: "GET",
    url: "/show_diary",
    data: { month: current_month },
    success: function (res) {
      let data = res["result"];
      data.forEach((a) => {
        if (a["month"] === current_month.toString()) {
          let emoji = a["emoji"];
          let day = a["day"];
          let month = a["month"];

          if (a["nickname"]) user_nickname = a["nickname"];

          user_current_month = month;

          // 이번달 유저의 감정상태 담기

          if (emoji === "1") {
            current_one_label[day - 1]++;
          }
          if (emoji === "2") {
            current_two_label[day - 1]++;
          }
          if (emoji === "3") {
            current_three_label[day - 1]++;
          }
          if (emoji === "4") {
            current_four_label[day - 1]++;
          }
          if (emoji === "5") {
            current_five_label[day - 1]++;
          }

          let current_one_label_sum = current_one_label.reduce(
            (acc, cur) => acc + cur,
            0
          );
          let current_two_label_sum = current_two_label.reduce(
            (acc, cur) => acc + cur,
            0
          );
          let current_three_label_sum = current_three_label.reduce(
            (acc, cur) => acc + cur,
            0
          );
          let current_four_label_sum = current_four_label.reduce(
            (acc, cur) => acc + cur,
            0
          );
          let current_five_label_sum = current_five_label.reduce(
            (acc, cur) => acc + cur,
            0
          );
          // let six_label_sum = six_label.reduce((acc, cur) => acc + cur, 0);

          const current_label_list = [
            current_one_label,
            current_two_label,
            current_three_label,
            current_four_label,
            current_five_label,
            //   six_label,
          ];

          let current_label_sum_list = [
            current_one_label_sum,
            current_two_label_sum,
            current_three_label_sum,
            current_four_label_sum,
            current_five_label_sum,
            //   six_label_sum,
          ];

          // 이번 달 가장 많은 감정을 변수에 담았음.
          const current_month_maxEmotion_label = Math.max(
            ...current_label_sum_list
          );

          // 이번 달 가장 많은 감정의 인덱스(실제 감정값)
          const current_month_maxEmotion_index = current_label_sum_list.indexOf(
            current_month_maxEmotion_label
          );

          // 이번 달 가장 많은 감정의 이름
          const current_month_maxEmotion_name =
            current_month_maxEmotion_index + 1;

          const current_month_maxEmotion_data = // 이번 달 가장 많은 감정의 데이터들.
            current_label_list[current_month_maxEmotion_index];

          // // 현황판 oo님
          // const notice_user = document.querySelector("#notice_user");
          // notice_user.textContent = user_nickname + "님은";

          const current_month_emotion = document.querySelector(
            "#current_month_emotion"
          );

          current_month_emotion.textContent = `이번 달 주요 감정은 ${
            current_month_maxEmotion_name === 1
              ? "홀가분"
              : current_month_maxEmotion_name === 2
              ? "좋음"
              : current_month_maxEmotion_name === 3
              ? "보통"
              : current_month_maxEmotion_name === 4
              ? "언짢음"
              : "화남"
          }입니다.`;

          const notice_current_month = document.querySelector(
            "#notice_currnet_month"
          );

          notice_current_month.textContent = `이번 달 ${
            current_month_maxEmotion_name === 1
              ? "홀가분"
              : current_month_maxEmotion_name === 2
              ? "좋음"
              : current_month_maxEmotion_name === 3
              ? "보통"
              : current_month_maxEmotion_name === 4
              ? "언짢음"
              : "화남"
          } 을`;

          const labels = new Array(31).fill(0).map((_, i) => i + 1);

          myChart2.data.labels = labels;

          myChart2.data.datasets[0] = {
            label:
              current_month_maxEmotion_name === 1
                ? "홀가분"
                : current_month_maxEmotion_name === 2
                ? "좋음"
                : current_month_maxEmotion_name === 3
                ? "보통"
                : current_month_maxEmotion_name === 4
                ? "언짢음"
                : "화남",
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",

              "rgba(255, 159, 64, 0.2)",

              "rgba(255, 205, 86, 0.2)",

              "rgba(75, 192, 192, 0.2)",

              "rgba(54, 162, 235, 0.2)",

              "rgba(153, 102, 255, 0.2)",

              "rgba(201, 203, 207, 0.2)",
            ],
            borderColor: [
              "rgb(255, 99, 132)",

              "rgb(255, 159, 64)",

              "rgb(255, 205, 86)",

              "rgb(75, 192, 192)",

              "rgb(54, 162, 235)",

              "rgb(153, 102, 255)",

              "rgb(201, 203, 207)",
            ],
            data: current_month_maxEmotion_data,
          };

          myChart2.update();
        }
      });
    },
  });
}

// // 현황판 oo님
// const notice_user = document.querySelector("#notice_user");
// notice_user.textContent = user_name + "님은";
