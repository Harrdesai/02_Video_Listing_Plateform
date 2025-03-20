// api for fetching list of videos
let pageNo = 1;
const fetchVideolist = async () => {
  const url = `https://api.freeapi.app/api/v1/public/youtube/videos?page=${pageNo}&limit=12&query=javascript&sortBy=keep%2520one%253A%2520mostLiked%2520%257C%2520mostViewed%2520%257C%2520latest%2520%257C%2520oldest`;
  const options = { method: 'GET', headers: { accept: 'application/json' } };

  try {
    const response = await fetch(url, options);
    const jsonData = await response.json();
    const data = jsonData.data.data
    return data
  } catch (error) {
    console.error(error);
  }
}
window.onload = fetchVideolist();

let video_Cards = [];

// render data in html
const renderData = async () => {
  const data = await fetchVideolist();
  const videoListing = document.getElementById('video_listing');
  videoListing.innerHTML = '';
  video_Cards = data.map(item => {
    const videoCard = document.createElement('div');
    videoCard.classList.add('video_Card');
    videoCard.id = item.items.id;
    videoCard.addEventListener('click', () => {
      window.location.href = `https://www.youtube.com/watch?v=${item.items.id}`
    })
    videoCard.innerHTML = `
      <div class="video_thumbnail">
        <img src="${item.items.snippet.thumbnails.maxres.url}" />
      </div>
      <div class="video_Title">${item.items.snippet.title}</div>
      <div class="channel_Name">${item.items.snippet.channelTitle}</div>
      <div class="video_Date">${timeAgo(item.items.snippet.publishedAt)}   •   ${viewsinShort(item.items.statistics.viewCount)}</div>
    `;
    videoListing.appendChild(videoCard);
    return {
      videoThumbnail: item.items.snippet.thumbnails.maxres.url,
      videoTitle: item.items.snippet.title,
      video_Date: timeAgo(item.items.snippet.publishedAt) + '   •   ' + viewsinShort(item.items.statistics.viewCount),
      videoChannel: item.items.snippet.channelTitle,
      videoId: item.items.id,
    }
  });
}
renderData();

// Search bar functionality
const searchInput = document.getElementById('SearchInput');

searchInput.addEventListener('input', (e) => {
  const query = e.target.value;
  const filteredData = video_Cards.filter(item => item.videoTitle.toLowerCase().includes(query.toLowerCase()));
  const videoListing = document.getElementById('video_listing');
  videoListing.innerHTML = '';
  filteredData.forEach(item => {
    const videoCard = document.createElement('div');
    videoCard.classList.add('video_Card');
    videoCard.id = item.videoId;
    videoCard.addEventListener('click', () => {
      window.location.href = `https://www.youtube.com/watch?v=${item.videoId}`
    })
    videoCard.innerHTML = `
      <div class="video_thumbnail">
        <img src="${item.videoThumbnail}" />
      </div>
      <div class="video_Title">${item.videoTitle}</div>
      <div class="channel_Name">${item.videoChannel}</div>
      <div class="video_Description">${item.video_Date}</div>
    `;
    videoListing.appendChild(videoCard);
  });
})


// pagination with rerender whole page with new data
const previousButton = document.getElementById('previous');
const nextButton = document.getElementById('next');

previousButton.addEventListener('click', () => {
  if (pageNo > 1) {
    pageNo--;
    renderData();
  }
});

nextButton.addEventListener('click', () => {
  pageNo++;
  renderData();
});

// function to convert time in ago from createdAt date
function timeAgo(createdAt) {
  const now = new Date();
  const createdAtDate = new Date(createdAt);
  const diff = now - createdAtDate;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} years ago`;
  } else if (months > 0) {
    return `${months} months ago`;
  } else if (days >= 0) {
    return `${days} days ago`;
  }
}

function viewsinShort (views) {
  if (views < 1000) {
    return `${views} views`;
  } else if (views >= 1000 && views < 1000000) {
    return `${(views / 1000).toFixed(1)}K views`;
  } else if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  }
}