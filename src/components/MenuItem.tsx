import React from 'react';
import './MenuItem.css';

interface MenuItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  isAvailable?: boolean;
  onSelect?: (item: MenuItem) => void;
}

interface MenuItem extends MenuItemProps {}

const MenuItem: React.FC<MenuItemProps> = ({
  id,
  name,
  description,
  price,
  image,
  category,
  isAvailable = true,
  onSelect,
}) => {
  const handleClick = () => {
    if (onSelect && isAvailable) {
      onSelect({ id, name, description, price, image, category, isAvailable });
    }
  };

  return (
    <div
      className={`menu-item ${!isAvailable ? 'unavailable' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {image && (
        <div className="menu-item-image-container">
          <img
            src={image}
            alt={name}
            className="menu-item-image"
            loading="lazy"
          />
        </div>
      )}

      <div className="menu-item-content">
        <h3 className="menu-item-name">{name}</h3>

        {category && <p className="menu-item-category">{category}</p>}

        <p className="menu-item-description">{description}</p>

        <div className="menu-item-footer">
          <span className="menu-item-price">${price.toFixed(2)}</span>
          {!isAvailable && <span className="menu-item-badge">Unavailable</span>}
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
