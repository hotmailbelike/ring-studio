interface SharedDesignBannerProps {
  onMakeCopy: () => void;
}

export function SharedDesignBanner({ onMakeCopy }: SharedDesignBannerProps) {
  return (
    <section className="shared-banner" aria-labelledby="shared-banner-title">
      <div>
        <h2 id="shared-banner-title" className="shared-banner__title">
          Shared design
        </h2>
        <p className="shared-banner__body">This link is view only. Make a copy to change it.</p>
      </div>
      <button type="button" className="button button--primary" onClick={onMakeCopy}>
        Make a copy / edit
      </button>
    </section>
  );
}
