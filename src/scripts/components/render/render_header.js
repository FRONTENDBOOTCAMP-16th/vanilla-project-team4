import { createSkipLink } from '/src/scripts/components/ui/skip_link';
import { createHeader } from '/src/scripts/components/ui/create_header_ui';

function renderHeader() {
  const skipLink = createSkipLink();
  document.body.prepend(skipLink);

  createHeader();
}

renderHeader();
