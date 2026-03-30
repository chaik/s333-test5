export default function decorate(block) {
  // Extract authored content
  const content = block.querySelector('div > div');
  const heading = content?.querySelector('h2');
  const label = content?.querySelector('p');

  // Clear original content
  block.textContent = '';

  // Build panel (left side)
  const panel = document.createElement('div');
  panel.className = 'coffee-tasting-panel';

  if (heading) panel.append(heading);

  const labelEl = document.createElement('p');
  labelEl.className = 'coffee-tasting-label';
  labelEl.textContent = label?.textContent || 'Find a Location NOW';
  panel.append(labelEl);

  const searchWrap = document.createElement('div');
  searchWrap.className = 'coffee-tasting-search';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'coffee-tasting-input';
  input.placeholder = 'Zip code';
  input.setAttribute('aria-label', 'Enter zip code');
  input.maxLength = 10;

  const searchBtn = document.createElement('button');
  searchBtn.type = 'button';
  searchBtn.className = 'coffee-tasting-button';
  searchBtn.textContent = 'Search';

  searchWrap.append(input, searchBtn);
  panel.append(searchWrap);

  // Build map placeholder (right side)
  const mapArea = document.createElement('div');
  mapArea.className = 'coffee-tasting-map';
  mapArea.setAttribute('aria-hidden', 'true');

  const mapPlaceholder = document.createElement('div');
  mapPlaceholder.className = 'coffee-tasting-map-placeholder';
  mapPlaceholder.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
    </svg>
    <span>Map View</span>
  `;
  mapArea.append(mapPlaceholder);

  // Build popup overlay
  const overlay = document.createElement('div');
  overlay.className = 'coffee-tasting-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Nearby Frescopa Locations');
  overlay.hidden = true;

  const modal = document.createElement('div');
  modal.className = 'coffee-tasting-modal';
  modal.innerHTML = `
    <button type="button" class="coffee-tasting-modal-close" aria-label="Close">&times;</button>
    <h3 class="coffee-tasting-modal-title">Nearby Frescopa Locations</h3>
    <p class="coffee-tasting-modal-subtitle"></p>
    <div class="coffee-tasting-results"></div>
    <div class="coffee-tasting-modal-actions">
      <button type="button" class="coffee-tasting-confirm-btn" disabled>Confirm Reservation</button>
    </div>
  `;
  overlay.append(modal);

  // Build confirmation overlay
  const confirmation = document.createElement('div');
  confirmation.className = 'coffee-tasting-confirmation';
  confirmation.setAttribute('role', 'dialog');
  confirmation.setAttribute('aria-modal', 'true');
  confirmation.hidden = true;
  confirmation.innerHTML = `
    <div class="coffee-tasting-confirm-card">
      <div class="coffee-tasting-confirm-icon" aria-hidden="true">&#10003;</div>
      <h3 class="coffee-tasting-confirm-title">Reservation Confirmed!</h3>
      <div class="coffee-tasting-confirm-details"></div>
      <button type="button" class="coffee-tasting-confirm-close">Done</button>
    </div>
  `;

  // Append all to block
  block.append(panel, mapArea, overlay, confirmation);

  // --- INTERACTIVE BEHAVIOR ---

  const USE_MOCK_DATA = true;

  function getMockAvailability() {
    return [
      {
        name: 'Frescopa Flagship - Downtown',
        address: '123 Main Street',
        distance: '0.8 mi',
        times: ['10:00 AM', '11:30 AM', '2:00 PM', '4:00 PM'],
      },
      {
        name: 'Frescopa Roastery',
        address: '456 Oak Avenue',
        distance: '1.2 mi',
        times: ['9:00 AM', '1:00 PM', '3:30 PM'],
      },
      {
        name: 'Frescopa Express',
        address: '789 Park Boulevard',
        distance: '2.5 mi',
        times: ['10:30 AM', '12:00 PM', '5:00 PM'],
      },
    ];
  }

  async function getAvailability(zipcode) {
    if (USE_MOCK_DATA) return getMockAvailability();

    const booking_service_url = "https://s333-frescopa-test1.testaemcloud.com";    
    const url = `${booking_service_url}/compute/coffee-tasting-booking?zipcode=${encodeURIComponent(zipcode)}`;

    const response = await fetch(url); 

    if (!response.ok) throw new Error(`Failed to fetch availability: ${response.status}`);
    const data = await response.json();
    return data.locations;
  }

  let selectedLocation = null;
  let selectedSlot = null;

  function renderResults(locations, zipCode) {
    const results = modal.querySelector('.coffee-tasting-results');
    const subtitle = modal.querySelector('.coffee-tasting-modal-subtitle');
    subtitle.textContent = `Showing results near ${zipCode}`;
    results.innerHTML = '';

    locations.forEach((loc) => {
      const card = document.createElement('div');
      card.className = 'coffee-tasting-location-card';
      card.innerHTML = `
        <div class="coffee-tasting-location-info">
          <h4 class="coffee-tasting-location-name">${loc.name}</h4>
          <p class="coffee-tasting-location-address">${loc.address}</p>
          <p class="coffee-tasting-location-distance">${loc.distance}</p>
        </div>
        <div class="coffee-tasting-time-slots">
          ${loc.times.map((slot) => `<button type="button" class="coffee-tasting-slot" data-location="${loc.name}" data-address="${loc.address}" data-slot="${slot}">${slot}</button>`).join('')}
        </div>
      `;
      results.append(card);
    });

    // Slot selection
    results.querySelectorAll('.coffee-tasting-slot').forEach((slotBtn) => {
      slotBtn.addEventListener('click', () => {
        results.querySelectorAll('.coffee-tasting-slot').forEach((s) => s.classList.remove('selected'));
        slotBtn.classList.add('selected');
        selectedLocation = slotBtn.dataset.location;
        selectedSlot = slotBtn.dataset.slot;
        const confirmBtn = modal.querySelector('.coffee-tasting-confirm-btn');
        confirmBtn.disabled = false;
      });
    });
  }

  // Search button click
  searchBtn.addEventListener('click', async () => {
    const zip = input.value.trim();
    if (!zip) {
      input.focus();
      return;
    }
    selectedLocation = null;
    selectedSlot = null;
    const confirmBtn = modal.querySelector('.coffee-tasting-confirm-btn');
    confirmBtn.disabled = true;
    try {
      const locations = await getAvailability(zip);
      renderResults(locations, zip);
      overlay.hidden = false;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error fetching availability:', e);
    }
  });

  // Enter key on input
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchBtn.click();
  });

  // Close modal
  modal.querySelector('.coffee-tasting-modal-close').addEventListener('click', () => {
    overlay.hidden = true;
  });

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.hidden = true;
  });

  // Confirm reservation
  modal.querySelector('.coffee-tasting-confirm-btn').addEventListener('click', () => {
    if (!selectedLocation || !selectedSlot) return;
    overlay.hidden = true;
    const details = confirmation.querySelector('.coffee-tasting-confirm-details');
    details.innerHTML = `
      <p><strong>Location:</strong> ${selectedLocation}</p>
      <p><strong>Time:</strong> ${selectedSlot}</p>
      <p>We look forward to seeing you!</p>
    `;
    confirmation.hidden = false;
  });

  // Close confirmation
  confirmation.querySelector('.coffee-tasting-confirm-close').addEventListener('click', () => {
    confirmation.hidden = true;
  });
}
