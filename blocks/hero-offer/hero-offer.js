export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;
  const cols = [...row.children];

  if (cols.length >= 2) {
    cols[0].classList.add('hero-offer-bg');
    cols[1].classList.add('hero-offer-content');
  }

  // Move picture to be a background
  const picture = cols[0]?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      block.style.backgroundImage = `url(${img.src})`;
      block.style.backgroundSize = 'cover';
      block.style.backgroundPosition = 'center';
    }
    cols[0].hidden = true;
  }

  // Style the content paragraphs
  const content = cols[1];
  if (content) {
    const paragraphs = content.querySelectorAll('p');
    if (paragraphs.length >= 2) {
      paragraphs[0].classList.add('hero-offer-pretitle');
      paragraphs[1].classList.add('hero-offer-detail');
    }
  }
}
