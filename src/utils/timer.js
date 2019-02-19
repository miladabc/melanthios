export default () => {
  const countDownDate = new Date();
  countDownDate.setSeconds(countDownDate.getSeconds() + 30);

  const timer = setInterval(() => {
    let now = new Date().getTime();

    let distance = countDownDate - now;

    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById(
      'remaining'
    ).innerHTML = `Try again in ${seconds} seconds`;

    if (distance < 0) {
      clearInterval(timer);
      document.getElementById('remaining').innerHTML = '';
    }
  }, 100);
};
