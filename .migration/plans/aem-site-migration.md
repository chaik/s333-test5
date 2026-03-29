# Site Migration to AEM Edge Delivery Services

## Overview
Migrate multiple pages from an existing website to AEM Edge Delivery Services using the EXCAT migration workflow. This plan covers end-to-end migration including site analysis, page analysis, block mapping, import infrastructure, content import, and design system adaptation.

## Prerequisites
- **URLs Required**: A list of page URLs to migrate must be provided before execution can begin
- **Local dev server**: Running at localhost:3000 via `aem up`
- **Project repo**: AEM boilerplate project initialized at `/workspace`

## Migration Workflow

### Phase 1: Site Analysis
- [ ] Collect and validate all target URLs from the user
- [ ] Analyze URL patterns to identify page templates (e.g., homepage, product page, article page)
- [ ] Create `page-templates.json` with template skeletons (name, URLs, description)
- [ ] Review and confirm template classification with the user

### Phase 2: Page Analysis (per template)
- [ ] Analyze representative page(s) for each template
- [ ] Identify content structure: sections, blocks, default content
- [ ] Capture screenshots and cleaned HTML for reference
- [ ] Document authoring decisions (what becomes a block vs. default content)
- [ ] Identify block variants across templates

### Phase 3: Block Mapping & Variant Management
- [ ] Map detected blocks to EDS block library equivalents
- [ ] Check for existing block variants with similarity matching (70% threshold)
- [ ] Create new block variants where needed
- [ ] Update `page-templates.json` with block mappings and DOM selectors
- [ ] Update `metadata.json` with variant tracking

### Phase 4: Import Infrastructure
- [ ] Generate block parsers for each identified block/variant
- [ ] Generate page transformers for each template
- [ ] Create bundled import script combining parsers and transformers
- [ ] Validate import script structure

### Phase 5: Content Import
- [ ] Run import script against target URLs
- [ ] Generate HTML content files in `/workspace/content/`
- [ ] Verify generated HTML structure and block tables
- [ ] Preview imported pages on local dev server
- [ ] Compare imported pages against originals for content accuracy

### Phase 6: Block Development
- [ ] Implement JavaScript decoration for any new/custom blocks
- [ ] Create CSS styles for new block variants
- [ ] Test block rendering on local preview
- [ ] Validate responsive behavior (mobile, tablet, desktop)

### Phase 7: Design System Adaptation
- [ ] Extract design tokens from original site (colors, typography, spacing)
- [ ] Map tokens to CSS custom properties in `styles/styles.css`
- [ ] Adapt global styles (fonts, base colors, link styles)
- [ ] Apply block-level styling to match original design
- [ ] Visual comparison and refinement

### Phase 8: Navigation Setup
- [ ] Analyze original site navigation structure
- [ ] Create `nav.html` with proper EDS navigation format
- [ ] Test header/footer rendering
- [ ] Verify responsive navigation behavior

### Phase 9: Validation & QA
- [ ] Preview all migrated pages on local dev server
- [ ] Run visual comparison against original pages
- [ ] Run linting (`npm run lint`)
- [ ] Check accessibility (heading hierarchy, alt text, ARIA)
- [ ] Validate performance best practices

## Checklist Summary
- [ ] User provides list of URLs to migrate
- [ ] Site analysis and template identification complete
- [ ] Page analysis complete for all templates
- [ ] Block mapping and variant management complete
- [ ] Import infrastructure (parsers, transformers, import script) created
- [ ] Content imported and verified for all pages
- [ ] Block code (JS/CSS) implemented and tested
- [ ] Design system extracted and applied
- [ ] Navigation set up and working
- [ ] Full QA pass completed
- [ ] Changes committed and ready for PR

## Next Steps
**To begin execution**, please provide the list of page URLs you'd like to migrate. Once URLs are provided, the migration will proceed through each phase sequentially, with checkpoints for your review at key milestones.

> **Note**: Execution requires exiting Plan mode. Once URLs are confirmed and the plan is approved, switch to Execute mode to begin the migration.
