function answerReveal1() {
    var dots = document.getElementById("end1");
    var moreText = document.getElementById("q1");
    var btnText = document.getElementById("ans1");
  
    if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "Read more";
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "Read less";
      moreText.style.display = "inline";
    }
  }
  function answerReveal2() {
    var dots = document.getElementById("end2");
    var moreText = document.getElementById("q2");
    var btnText = document.getElementById("ans2");
  
    if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "Read more";
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "Read less";
      moreText.style.display = "inline";
    }
  }
