$(function(){
  /* 반짝세일 */
  const time_el = document.querySelector('.time');

  let total_seconds = 24 * 60 * 60;

  function update_timer() {
    const hours = String(Math.floor(total_seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((total_seconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(total_seconds % 60).padStart(2, '0');

    time_el.textContent = `${hours}:${minutes}:${seconds}`;

    if (total_seconds > 0) total_seconds--;
    }
    
  setInterval(update_timer, 1000);
  update_timer();

  /* 키워드 랭킹 */
window.addEventListener('DOMContentLoaded', () => {
  const keywordList = document.querySelector('.keyword_list');
  const items = Array.from(document.querySelectorAll('.keyword_item'));
  const itemCount = items.length;


  // 첫 아이템 복제
  const firstClone = items[0].cloneNode(true);
  keywordList.appendChild(firstClone);

  let index = 0;

  function getItemHeight() {
    return items[0].getBoundingClientRect().height;
  }

  function moveKeyword() {
    const itemHeight = getItemHeight();
    index++;
    keywordList.style.transition = 'transform 0.5s ease-in-out';
    keywordList.style.transform = `translateY(${-index * itemHeight}px)`;

    // 계속 순환되게하기
    if (index === itemCount) {
      setTimeout(() => {
        keywordList.style.transition = 'none';
        keywordList.style.transform = `translateY(0)`;
        index = 0;
      }, 500);
    }
  }

  // 3초마다 자동 이동
  let interval = setInterval(moveKeyword, 3000);

  // 모바일 터치 시 일시정지
  keywordList.addEventListener('touchstart', () => clearInterval(interval));
  keywordList.addEventListener('touchend', () => interval = setInterval(moveKeyword, 5000));

  // 화면 크기 변경 시 높이 다시 계산
  window.addEventListener('resize', () => {
    const itemHeight = getItemHeight();
    keywordList.style.transition = 'none';
    keywordList.style.transform = `translateY(${-index * itemHeight}px)`;
  });
});

const sliderContainer = document.getElementById('sliderContainer');
const slides = sliderContainer.querySelectorAll('.slider_item');
const dotsContainer = document.getElementById('sliderDots');
let currentIndex = 0;
const totalSlides = slides.length;

// dot 생성
slides.forEach((_, i) => {
  const dot = document.createElement('span');
  dot.classList.add('dot');
  if(i===0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

// 슬라이드 이동
function goToSlide(index){
  sliderContainer.style.transform = `translateX(-${index * 100}%)`;
  currentIndex = index;
  updateDots();
}

// dot 업데이트
function updateDots(){
  const dots = dotsContainer.querySelectorAll('.dot');
  dots.forEach(dot => dot.classList.remove('active'));
  dots[currentIndex].classList.add('active');
}

// 자동 슬라이드
function nextSlide(){
  currentIndex = (currentIndex + 1) % totalSlides;
  goToSlide(currentIndex);
}
let slideInterval = setInterval(nextSlide, 3000);

// 마우스 오버시 일시정지
sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
sliderContainer.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 3000));

let startX = 0;
let isDragging = false;

/* 스와이프해서 넘길 수 있게 */
// 터치 시작
sliderContainer.addEventListener('touchstart', (e) => {
  clearInterval(slideInterval); // 자동 슬라이드 잠시 멈춤
  startX = e.touches[0].clientX;
  isDragging = true;
});

// 터치 이동
sliderContainer.addEventListener('touchmove', (e) => {
  if(!isDragging) return;
  const moveX = e.touches[0].clientX - startX;
  sliderContainer.style.transform = `translateX(${-currentIndex * 100 + (moveX / sliderContainer.clientWidth) * 100}%)`;
});

// 터치 끝
sliderContainer.addEventListener('touchend', (e) => {
  isDragging = false;
  const endX = e.changedTouches[0].clientX;
  const diff = endX - startX;

  if(diff > 50){ // 오른쪽으로 스와이프 → 이전 슬라이드
    currentIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
  } else if(diff < -50){ // 왼쪽으로 스와이프 → 다음 슬라이드
    currentIndex = (currentIndex + 1) % totalSlides;
  }

  goToSlide(currentIndex);
  slideInterval = setInterval(nextSlide, 3000); // 자동 슬라이드 재개
});
});