import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { SimpleProductCard } from '../../components/SimpleProductCard/SimpleProductCard';
import Button from '../../components/Button/Button';
import './ProductsPage.css';

// DropdownFilter Component
interface DropdownFilterProps {
  label: string;
  icon: string;
  items: string[];
  selectedItems: string[];
  onItemToggle: (item: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  multiColumn?: boolean;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  label,
  icon,
  items,
  selectedItems,
  onItemToggle,
  isOpen,
  onToggle,
  multiColumn = false
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  const handleItemClick = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    onItemToggle(item);
  };

  const selectedCount = selectedItems.length;
  const hasSelection = selectedCount > 0;

  return (
    <div className="dropdown-filter">
      <button
        className={`dropdown-filter-btn ${hasSelection ? 'active' : ''} ${isOpen ? 'open' : ''}`}
        onClick={handleClick}
      >
        <span>
          <i className={icon}></i>{" "}
          {label}
          {hasSelection && <span> ({selectedCount})</span>}
        </span>
        <i className="fas fa-chevron-down"></i>
      </button>
      
      {isOpen && (
        <div className={`dropdown-content ${multiColumn ? 'four-columns' : ''}`}>
          {items.map((item) => {
            const isSelected = selectedItems.includes(item);
            return (
              <div
                key={item}
                className={`dropdown-item ${isSelected ? 'selected' : ''}`}
                onClick={(e) => handleItemClick(e, item)}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}} // Handled by onClick
                />
                <span>{item}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface PriceRange {
  min: number;
  max: number | null;
  label: string;
}

const PRICE_RANGES: PriceRange[] = [
  { min: 0, max: 500000, label: 'Dưới 500K' },
  { min: 500000, max: 1000000, label: '500K - 1TR' },
  { min: 1000000, max: 2000000, label: '1TR - 2TR' },
  { min: 2000000, max: 5000000, label: '2TR - 5TR' },
  { min: 5000000, max: null, label: 'Trên 5TR' },
];

const INITIAL_DISPLAY = 16;
const LOAD_MORE_COUNT = 12;

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  
  const categoryFromUrl = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = React.useState<string>(categoryFromUrl);
  const [sortBy, setSortBy] = React.useState<string>('newest');
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = React.useState<string>('');
  const [selectedSubcategories, setSelectedSubcategories] = React.useState<string[]>([]);
  // New detailed filters
  const [selectedConnectionTypes, setSelectedConnectionTypes] = React.useState<string[]>([]);
  const [selectedCompatibility, setSelectedCompatibility] = React.useState<string[]>([]);
  const [selectedFormFactors, setSelectedFormFactors] = React.useState<string[]>([]);
  const [selectedLedTypes, setSelectedLedTypes] = React.useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = React.useState<string[]>([]);
  // Headset specific filters
  const [selectedHeadsetTypes, setSelectedHeadsetTypes] = React.useState<string[]>([]);
  const [selectedUseCases, setSelectedUseCases] = React.useState<string[]>([]);
  // Monitor specific filters
  const [selectedScreenSizes, setSelectedScreenSizes] = React.useState<string[]>([]);
  const [selectedRefreshRates, setSelectedRefreshRates] = React.useState<string[]>([]);
  const [selectedResolutions, setSelectedResolutions] = React.useState<string[]>([]);
  const [selectedResponseTimes, setSelectedResponseTimes] = React.useState<string[]>([]);
  const [selectedPanelTypes, setSelectedPanelTypes] = React.useState<string[]>([]);
  const [selectedMonitorFeatures, setSelectedMonitorFeatures] = React.useState<string[]>([]);
  // USB filters state
  const [selectedStorageCapacities, setSelectedStorageCapacities] = React.useState<string[]>([]);
  const [selectedUsbTypes, setSelectedUsbTypes] = React.useState<string[]>([]);
  const [selectedReadSpeeds, setSelectedReadSpeeds] = React.useState<string[]>([]);
  const [selectedWriteSpeeds, setSelectedWriteSpeeds] = React.useState<string[]>([]);
  const [selectedMemoryCardTypes, setSelectedMemoryCardTypes] = React.useState<string[]>([]);
  // Digital filters state
  const [selectedContentTypes, setSelectedContentTypes] = React.useState<string[]>([]);
  const [selectedFormatTypes, setSelectedFormatTypes] = React.useState<string[]>([]);
  const [selectedLicenseTypes, setSelectedLicenseTypes] = React.useState<string[]>([]);
  const [selectedSoftwareCompatibility, setSelectedSoftwareCompatibility] = React.useState<string[]>([]);
  // Other products filters
  const [selectedPriceRanges, setSelectedPriceRanges] = React.useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = React.useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = React.useState<string[]>([]);
  const [displayCount, setDisplayCount] = React.useState<number>(INITIAL_DISPLAY);

  // Dropdown open states
  const [openDropdowns, setOpenDropdowns] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      // Reset filters when category changes
      setSelectedBrands([]);
      setSelectedPriceRange('');
      setSelectedSubcategories([]);
      setSelectedConnectionTypes([]);
      setSelectedCompatibility([]);
      setSelectedFormFactors([]);
      setSelectedLedTypes([]);
      setSelectedFeatures([]);
      setSelectedHeadsetTypes([]);
      setSelectedUseCases([]);
      setSelectedScreenSizes([]);
      setSelectedRefreshRates([]);
      setSelectedResolutions([]);
      setSelectedResponseTimes([]);
      setSelectedPanelTypes([]);
      setSelectedMonitorFeatures([]);
      setSelectedStorageCapacities([]);
      setSelectedUsbTypes([]);
      setSelectedReadSpeeds([]);
      setSelectedWriteSpeeds([]);
      setSelectedMemoryCardTypes([]);
      setSelectedContentTypes([]);
      setSelectedFormatTypes([]);
      setSelectedLicenseTypes([]);
      setSelectedSoftwareCompatibility([]);
      setSelectedPriceRanges([]);
      setSelectedProductTypes([]);
      setSelectedMaterials([]);
      setDisplayCount(INITIAL_DISPLAY);
    }
  }, [searchParams]);

  // Extract brands from products based on brand field or tags
  const availableBrands = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const brands = new Set<string>();
    categoryProducts.forEach(product => {
      // Check brand field first (new approach)
      if (product.brand) {
        brands.add(product.brand);
      }
      // Fallback to tags for backward compatibility
      const brandTags = ['LOGITECH', 'RAZER', 'CORSAIR', 'STEELSERIES', 'AKKO', 'DAREU', 'KEYCHRON', 'FILCO', 'LEOPOLD', 'APPLE', 'ASUS', 'E-DRA', 'RAPOO'];
      if (product.tags && Array.isArray(product.tags)) {
        product.tags.forEach(tag => {
          const upperTag = tag.toUpperCase();
          if (brandTags.includes(upperTag)) {
            brands.add(upperTag);
          }
        });
      }
    });
    
    return Array.from(brands).sort();
  }, [products, selectedCategory]);

  // Extract connection types
  const availableConnectionTypes = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const connectionTypes = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.connection_types && Array.isArray(product.connection_types)) {
        product.connection_types.forEach(type => connectionTypes.add(type));
      }
    });
    
    return Array.from(connectionTypes).sort();
  }, [products, selectedCategory]);

  // Extract compatibility options
  const availableCompatibility = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const compatibility = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.compatibility && Array.isArray(product.compatibility)) {
        product.compatibility.forEach(comp => compatibility.add(comp));
      }
    });
    
    return Array.from(compatibility).sort();
  }, [products, selectedCategory]);

  // Extract form factors
  const availableFormFactors = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const formFactors = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.form_factor) {
        formFactors.add(product.form_factor);
      }
    });
    
    return Array.from(formFactors).sort();
  }, [products, selectedCategory]);

  // Extract LED types
  const availableLedTypes = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const ledTypes = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.led_type) {
        ledTypes.add(product.led_type);
      }
    });
    
    return Array.from(ledTypes).sort();
  }, [products, selectedCategory]);

  // Extract features
  const availableFeatures = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const features = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.features_detailed) {
        product.features_detailed.forEach(feature => features.add(feature));
      }
    });
    
    return Array.from(features).sort();
  }, [products, selectedCategory]);

  // Extract headset types
  const availableHeadsetTypes = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const headsetTypes = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.headset_type) {
        headsetTypes.add(product.headset_type);
      }
    });
    
    return Array.from(headsetTypes).sort();
  }, [products, selectedCategory]);

  // Extract use cases
  const availableUseCases = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const useCases = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.use_cases) {
        product.use_cases.forEach(useCase => useCases.add(useCase));
      }
    });
    
    return Array.from(useCases).sort();
  }, [products, selectedCategory]);

  // Extract monitor screen sizes
  const availableScreenSizes = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const screenSizes = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.screen_size) {
        screenSizes.add(product.screen_size);
      }
    });
    
    return Array.from(screenSizes).sort();
  }, [products, selectedCategory]);

  // Extract monitor refresh rates
  const availableRefreshRates = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const refreshRates = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.refresh_rate) {
        refreshRates.add(product.refresh_rate);
      }
    });
    
    return Array.from(refreshRates).sort();
  }, [products, selectedCategory]);

  // Extract monitor resolutions
  const availableResolutions = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const resolutions = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.resolution) {
        resolutions.add(product.resolution);
      }
    });
    
    return Array.from(resolutions).sort();
  }, [products, selectedCategory]);

  // Extract monitor response times
  const availableResponseTimes = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const responseTimes = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.response_time) {
        responseTimes.add(product.response_time);
      }
    });
    
    return Array.from(responseTimes).sort();
  }, [products, selectedCategory]);

  // Extract monitor panel types
  const availablePanelTypes = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const panelTypes = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.panel_type) {
        panelTypes.add(product.panel_type);
      }
    });
    
    return Array.from(panelTypes).sort();
  }, [products, selectedCategory]);

  // Extract monitor features
  const availableMonitorFeatures = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const monitorFeatures = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.monitor_features) {
        product.monitor_features.forEach(feature => monitorFeatures.add(feature));
      }
    });
    
    return Array.from(monitorFeatures).sort();
  }, [products, selectedCategory]);

  // Extract USB storage capacities
  const availableStorageCapacities = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const capacities = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.storage_capacity) {
        capacities.add(product.storage_capacity);
      }
    });
    
    return Array.from(capacities).sort();
  }, [products, selectedCategory]);

  // Extract USB types
  const availableUsbTypes = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const usbTypes = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.usb_type) {
        usbTypes.add(product.usb_type);
      }
    });
    
    return Array.from(usbTypes).sort();
  }, [products, selectedCategory]);

  // Extract read speeds
  const availableReadSpeeds = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const readSpeeds = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.read_speed) {
        readSpeeds.add(product.read_speed);
      }
    });
    
    return Array.from(readSpeeds).sort();
  }, [products, selectedCategory]);

  // Extract write speeds
  const availableWriteSpeeds = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const writeSpeeds = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.write_speed) {
        writeSpeeds.add(product.write_speed);
      }
    });
    
    return Array.from(writeSpeeds).sort();
  }, [products, selectedCategory]);

  // Extract memory card types
  const availableMemoryCardTypes = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const cardTypes = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.memory_card_type) {
        cardTypes.add(product.memory_card_type);
      }
    });
    
    return Array.from(cardTypes).sort();
  }, [products, selectedCategory]);

  // Extract digital content types
  const availableContentTypes = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const contentTypes = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.content_type) {
        contentTypes.add(product.content_type);
      }
    });
    
    return Array.from(contentTypes).sort();
  }, [products, selectedCategory]);

  // Extract digital format types
  const availableFormatTypes = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const formatTypes = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.format_type) {
        formatTypes.add(product.format_type);
      }
    });
    
    return Array.from(formatTypes).sort();
  }, [products, selectedCategory]);

  // Extract digital license types
  const availableLicenseTypes = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const licenseTypes = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.license_type) {
        licenseTypes.add(product.license_type);
      }
    });
    
    return Array.from(licenseTypes).sort();
  }, [products, selectedCategory]);

  // Extract digital software compatibility
  const availableSoftwareCompatibility = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const softwareCompat = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.software_compatibility) {
        product.software_compatibility.forEach(software => softwareCompat.add(software));
      }
    });
    
    return Array.from(softwareCompat).sort();
  }, [products, selectedCategory]);

  // Extract other products price ranges
  const availableOtherPriceRanges = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const priceRanges = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.price_range) {
        priceRanges.add(product.price_range);
      }
    });
    
    return Array.from(priceRanges).sort();
  }, [products, selectedCategory]);

  // Extract other products product types
  const availableOtherProductTypes = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const productTypes = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.product_type) {
        productTypes.add(product.product_type);
      }
    });
    
    return Array.from(productTypes).sort();
  }, [products, selectedCategory]);

  // Extract other products materials
  const availableOtherMaterials = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const materials = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.material) {
        materials.add(product.material);
      }
    });
    
    return Array.from(materials).sort();
  }, [products, selectedCategory]);

  // Extract subcategories from products
  const availableSubcategories = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    const subcategories = [...new Set(categoryProducts.map(p => p.subcategory))].filter(Boolean);
    return subcategories;
  }, [products, selectedCategory]);

  React.useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const filteredProducts = React.useMemo(() => {
    let filtered = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => {
        // Check brand field first
        if (product.brand && selectedBrands.includes(product.brand)) {
          return true;
        }
        // Fallback to tags
        return selectedBrands.some(brand =>
          product.tags.some(tag => tag.toUpperCase() === brand.toUpperCase())
        );
      });
    }

    // Filter by connection types
    if (selectedConnectionTypes.length > 0) {
      filtered = filtered.filter(product =>
        product.connection_types && 
        selectedConnectionTypes.some(type => product.connection_types?.includes(type))
      );
    }

    // Filter by compatibility
    if (selectedCompatibility.length > 0) {
      filtered = filtered.filter(product =>
        product.compatibility && 
        selectedCompatibility.some(comp => product.compatibility?.includes(comp))
      );
    }

    // Filter by form factors
    if (selectedFormFactors.length > 0) {
      filtered = filtered.filter(product =>
        product.form_factor && selectedFormFactors.includes(product.form_factor)
      );
    }

    // Filter by LED types
    if (selectedLedTypes.length > 0) {
      filtered = filtered.filter(product =>
        product.led_type && selectedLedTypes.includes(product.led_type)
      );
    }

    // Filter by features
    if (selectedFeatures.length > 0) {
      filtered = filtered.filter(product =>
        product.features_detailed && 
        selectedFeatures.some(feature => product.features_detailed?.includes(feature))
      );
    }

    // Filter by headset types
    if (selectedHeadsetTypes.length > 0) {
      filtered = filtered.filter(product =>
        product.headset_type && selectedHeadsetTypes.includes(product.headset_type)
      );
    }

    // Filter by use cases
    if (selectedUseCases.length > 0) {
      filtered = filtered.filter(product =>
        product.use_cases && 
        selectedUseCases.some(useCase => product.use_cases?.includes(useCase))
      );
    }

    // Filter by screen sizes
    if (selectedScreenSizes.length > 0) {
      filtered = filtered.filter(product =>
        product.screen_size && selectedScreenSizes.includes(product.screen_size)
      );
    }

    // Filter by refresh rates
    if (selectedRefreshRates.length > 0) {
      filtered = filtered.filter(product =>
        product.refresh_rate && selectedRefreshRates.includes(product.refresh_rate)
      );
    }

    // Filter by resolutions
    if (selectedResolutions.length > 0) {
      filtered = filtered.filter(product =>
        product.resolution && selectedResolutions.includes(product.resolution)
      );
    }

    // Filter by response times
    if (selectedResponseTimes.length > 0) {
      filtered = filtered.filter(product =>
        product.response_time && selectedResponseTimes.includes(product.response_time)
      );
    }

    // Filter by panel types
    if (selectedPanelTypes.length > 0) {
      filtered = filtered.filter(product =>
        product.panel_type && selectedPanelTypes.includes(product.panel_type)
      );
    }

    // Filter by monitor features
    if (selectedMonitorFeatures.length > 0) {
      filtered = filtered.filter(product =>
        product.monitor_features && 
        selectedMonitorFeatures.some(feature => product.monitor_features?.includes(feature))
      );
    }

    // Filter by storage capacities
    if (selectedStorageCapacities.length > 0) {
      filtered = filtered.filter(product =>
        product.storage_capacity && selectedStorageCapacities.includes(product.storage_capacity)
      );
    }

    // Filter by USB types
    if (selectedUsbTypes.length > 0) {
      filtered = filtered.filter(product =>
        product.usb_type && selectedUsbTypes.includes(product.usb_type)
      );
    }

    // Filter by read speeds
    if (selectedReadSpeeds.length > 0) {
      filtered = filtered.filter(product =>
        product.read_speed && selectedReadSpeeds.includes(product.read_speed)
      );
    }

    // Filter by write speeds
    if (selectedWriteSpeeds.length > 0) {
      filtered = filtered.filter(product =>
        product.write_speed && selectedWriteSpeeds.includes(product.write_speed)
      );
    }

    // Filter by memory card types
    if (selectedMemoryCardTypes.length > 0) {
      filtered = filtered.filter(product =>
        product.memory_card_type && selectedMemoryCardTypes.includes(product.memory_card_type)
      );
    }

    // Filter by content types
    if (selectedContentTypes.length > 0) {
      filtered = filtered.filter(product =>
        product.content_type && selectedContentTypes.includes(product.content_type)
      );
    }

    // Filter by format types
    if (selectedFormatTypes.length > 0) {
      filtered = filtered.filter(product =>
        product.format_type && selectedFormatTypes.includes(product.format_type)
      );
    }

    // Filter by license types
    if (selectedLicenseTypes.length > 0) {
      filtered = filtered.filter(product =>
        product.license_type && selectedLicenseTypes.includes(product.license_type)
      );
    }

    // Filter by software compatibility
    if (selectedSoftwareCompatibility.length > 0) {
      filtered = filtered.filter(product =>
        product.software_compatibility && 
        selectedSoftwareCompatibility.some(software => product.software_compatibility?.includes(software))
      );
    }

    // Filter other products by price range
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter(product =>
        product.price_range && selectedPriceRanges.includes(product.price_range)
      );
    }

    // Filter other products by product type
    if (selectedProductTypes.length > 0) {
      filtered = filtered.filter(product =>
        product.product_type && selectedProductTypes.includes(product.product_type)
      );
    }

    // Filter other products by material
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter(product =>
        product.material && selectedMaterials.includes(product.material)
      );
    }

    // Filter by subcategories
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedSubcategories.includes(product.subcategory)
      );
    }

    // Filter by price range
    if (selectedPriceRange) {
      const range = PRICE_RANGES.find(r => r.label === selectedPriceRange);
      if (range) {
        filtered = filtered.filter(product => {
          const price = product.price_vnd;
          return price >= range.min && (range.max === null || price <= range.max);
        });
      }
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price_vnd - b.price_vnd);
      case 'price-high':
        return filtered.sort((a, b) => b.price_vnd - a.price_vnd);
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }, [products, selectedCategory, selectedBrands, selectedConnectionTypes, selectedCompatibility, selectedFormFactors, selectedLedTypes, selectedFeatures, selectedHeadsetTypes, selectedUseCases, selectedScreenSizes, selectedRefreshRates, selectedResolutions, selectedResponseTimes, selectedPanelTypes, selectedMonitorFeatures, selectedStorageCapacities, selectedUsbTypes, selectedReadSpeeds, selectedWriteSpeeds, selectedMemoryCardTypes, selectedContentTypes, selectedFormatTypes, selectedLicenseTypes, selectedSoftwareCompatibility, selectedPriceRanges, selectedProductTypes, selectedMaterials, selectedSubcategories, selectedPriceRange, sortBy]);

  const displayedProducts = filteredProducts.slice(0, displayCount);
  const hasMoreProducts = filteredProducts.length > displayCount;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + LOAD_MORE_COUNT);
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleConnectionTypeToggle = (connectionType: string) => {
    setSelectedConnectionTypes(prev =>
      prev.includes(connectionType)
        ? prev.filter(c => c !== connectionType)
        : [...prev, connectionType]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleCompatibilityToggle = (compatibility: string) => {
    setSelectedCompatibility(prev =>
      prev.includes(compatibility)
        ? prev.filter(c => c !== compatibility)
        : [...prev, compatibility]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleFormFactorToggle = (formFactor: string) => {
    setSelectedFormFactors(prev =>
      prev.includes(formFactor)
        ? prev.filter(f => f !== formFactor)
        : [...prev, formFactor]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleLedTypeToggle = (ledType: string) => {
    setSelectedLedTypes(prev =>
      prev.includes(ledType)
        ? prev.filter(l => l !== ledType)
        : [...prev, ledType]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleHeadsetTypeToggle = (headsetType: string) => {
    setSelectedHeadsetTypes(prev =>
      prev.includes(headsetType)
        ? prev.filter(h => h !== headsetType)
        : [...prev, headsetType]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleUseCaseToggle = (useCase: string) => {
    setSelectedUseCases(prev =>
      prev.includes(useCase)
        ? prev.filter(u => u !== useCase)
        : [...prev, useCase]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleScreenSizeToggle = (screenSize: string) => {
    setSelectedScreenSizes(prev =>
      prev.includes(screenSize)
        ? prev.filter(s => s !== screenSize)
        : [...prev, screenSize]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleRefreshRateToggle = (refreshRate: string) => {
    setSelectedRefreshRates(prev =>
      prev.includes(refreshRate)
        ? prev.filter(r => r !== refreshRate)
        : [...prev, refreshRate]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleResolutionToggle = (resolution: string) => {
    setSelectedResolutions(prev =>
      prev.includes(resolution)
        ? prev.filter(r => r !== resolution)
        : [...prev, resolution]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleResponseTimeToggle = (responseTime: string) => {
    setSelectedResponseTimes(prev =>
      prev.includes(responseTime)
        ? prev.filter(r => r !== responseTime)
        : [...prev, responseTime]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handlePanelTypeToggle = (panelType: string) => {
    setSelectedPanelTypes(prev =>
      prev.includes(panelType)
        ? prev.filter(p => p !== panelType)
        : [...prev, panelType]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleMonitorFeatureToggle = (feature: string) => {
    setSelectedMonitorFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  // USB filter handlers
  const handleStorageCapacityToggle = (capacity: string) => {
    setSelectedStorageCapacities(prev =>
      prev.includes(capacity)
        ? prev.filter(c => c !== capacity)
        : [...prev, capacity]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleUsbTypeToggle = (usbType: string) => {
    setSelectedUsbTypes(prev =>
      prev.includes(usbType)
        ? prev.filter(u => u !== usbType)
        : [...prev, usbType]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleReadSpeedToggle = (readSpeed: string) => {
    setSelectedReadSpeeds(prev =>
      prev.includes(readSpeed)
        ? prev.filter(r => r !== readSpeed)
        : [...prev, readSpeed]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleWriteSpeedToggle = (writeSpeed: string) => {
    setSelectedWriteSpeeds(prev =>
      prev.includes(writeSpeed)
        ? prev.filter(w => w !== writeSpeed)
        : [...prev, writeSpeed]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleMemoryCardTypeToggle = (cardType: string) => {
    setSelectedMemoryCardTypes(prev =>
      prev.includes(cardType)
        ? prev.filter(c => c !== cardType)
        : [...prev, cardType]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  // Digital filter handlers
  const handleContentTypeToggle = (contentType: string) => {
    setSelectedContentTypes(prev =>
      prev.includes(contentType)
        ? prev.filter(c => c !== contentType)
        : [...prev, contentType]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleFormatTypeToggle = (formatType: string) => {
    setSelectedFormatTypes(prev =>
      prev.includes(formatType)
        ? prev.filter(f => f !== formatType)
        : [...prev, formatType]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleLicenseTypeToggle = (licenseType: string) => {
    setSelectedLicenseTypes(prev =>
      prev.includes(licenseType)
        ? prev.filter(l => l !== licenseType)
        : [...prev, licenseType]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleSoftwareCompatibilityToggle = (software: string) => {
    setSelectedSoftwareCompatibility(prev =>
      prev.includes(software)
        ? prev.filter(s => s !== software)
        : [...prev, software]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleOtherPriceRangeToggle = (priceRange: string) => {
    setSelectedPriceRanges(prev =>
      prev.includes(priceRange)
        ? prev.filter(p => p !== priceRange)
        : [...prev, priceRange]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleOtherProductTypeToggle = (productType: string) => {
    setSelectedProductTypes(prev =>
      prev.includes(productType)
        ? prev.filter(p => p !== productType)
        : [...prev, productType]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleOtherMaterialToggle = (material: string) => {
    setSelectedMaterials(prev =>
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleSubcategoryToggle = (subcategory: string) => {
    setSelectedSubcategories(prev =>
      prev.includes(subcategory)
        ? prev.filter(s => s !== subcategory)
        : [...prev, subcategory]
    );
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handlePriceRangeChange = (range: string) => {
    setSelectedPriceRange(range === selectedPriceRange ? '' : range);
    setDisplayCount(INITIAL_DISPLAY);
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedSubcategories([]);
    setSelectedConnectionTypes([]);
    setSelectedCompatibility([]);
    setSelectedFormFactors([]);
    setSelectedLedTypes([]);
    setSelectedFeatures([]);
    setSelectedHeadsetTypes([]);
    setSelectedUseCases([]);
    setSelectedScreenSizes([]);
    setSelectedRefreshRates([]);
    setSelectedResolutions([]);
    setSelectedResponseTimes([]);
    setSelectedPanelTypes([]);
    setSelectedMonitorFeatures([]);
    setSelectedStorageCapacities([]);
    setSelectedUsbTypes([]);
    setSelectedReadSpeeds([]);
    setSelectedWriteSpeeds([]);
    setSelectedMemoryCardTypes([]);
    setSelectedContentTypes([]);
    setSelectedFormatTypes([]);
    setSelectedLicenseTypes([]);
    setSelectedSoftwareCompatibility([]);
    setSelectedPriceRanges([]);
    setSelectedProductTypes([]);
    setSelectedMaterials([]);
    setSelectedPriceRange('');
    setDisplayCount(INITIAL_DISPLAY);
  };

  // Dropdown handlers
  const toggleDropdown = (dropdownId: string) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dropdownId)) {
        newSet.delete(dropdownId);
      } else {
        newSet.clear(); // Close other dropdowns
        newSet.add(dropdownId);
      }
      return newSet;
    });
  };

  const closeAllDropdowns = () => {
    setOpenDropdowns(new Set());
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      closeAllDropdowns();
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Early return for loading/error states BEFORE any useMemo computations
  if (productsLoading || categoriesLoading) {
    return (
      <div className="products-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="products-page">
        <div className="error-container">
          <i className="fas fa-exclamation-triangle"></i>
          <p>Không thể tải sản phẩm. Vui lòng thử lại!</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            <i className="fas fa-redo"></i> Thử lại
          </button>
        </div>
      </div>
    );
  }
  
  // Guard: Ensure products array exists before rendering
  if (!products || products.length === 0) {
    return (
      <div className="products-page">
        <div className="empty-container">
          <i className="fas fa-box-open"></i>
          <p>Chưa có sản phẩm nào.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">
              <i className="fas fa-th-large"></i>
              Tất Cả Sản Phẩm
            </h1>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="products-controls">
          <div className="filter-section">
            <h3>
              <i className="fas fa-filter"></i>
              Lọc theo danh mục
            </h3>
            <div className="category-filters">
              <button
                className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                <i className="fas fa-th"></i>
                Tất cả ({products.length})
              </button>
              {categories.map((category) => {
                const count = products.filter(p => p.category === category.id).length;
                return (
                  <button
                    key={category.id}
                    className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <i className={category.icon}></i>
                    {category.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sort-section">
            <h3>
              <i className="fas fa-sort"></i>
              Sắp xếp
            </h3>
            <div className="sort-select-wrapper">
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Mới nhất</option>
                <option value="price-low">Giá thấp đến cao</option>
                <option value="price-high">Giá cao đến thấp</option>
                <option value="name">Tên A-Z</option>
              </select>
              <i className="fas fa-chevron-down sort-icon"></i>
            </div>
          </div>
        </div>

        {/* Advanced Filters Section */}
        <div className="advanced-filters-container">{/* Advanced Filters */}
          {/* Dropdown Filters for Keyboard */}
          {selectedCategory === 'keyboard' && (
            <div className="dropdown-filters">
              {availableBrands.length > 0 && (
                <DropdownFilter
                  label="Thương hiệu"
                  icon="fas fa-tags"
                  items={availableBrands}
                  selectedItems={selectedBrands}
                  onItemToggle={handleBrandToggle}
                  isOpen={openDropdowns.has('keyboard-brands')}
                  onToggle={() => toggleDropdown('keyboard-brands')}
                />
              )}

              {availableConnectionTypes.length > 0 && (
                <DropdownFilter
                  label="Kết nối"
                  icon="fas fa-plug"
                  items={availableConnectionTypes}
                  selectedItems={selectedConnectionTypes}
                  onItemToggle={handleConnectionTypeToggle}
                  isOpen={openDropdowns.has('keyboard-connections')}
                  onToggle={() => toggleDropdown('keyboard-connections')}
                />
              )}

              {availableCompatibility.length > 0 && (
                <DropdownFilter
                  label="Tương thích"
                  icon="fas fa-desktop"
                  items={availableCompatibility}
                  selectedItems={selectedCompatibility}
                  onItemToggle={handleCompatibilityToggle}
                  isOpen={openDropdowns.has('keyboard-compatibility')}
                  onToggle={() => toggleDropdown('keyboard-compatibility')}
                />
              )}

              {availableFormFactors.length > 0 && (
                <DropdownFilter
                  label="Loại bàn phím"
                  icon="fas fa-keyboard"
                  items={availableFormFactors}
                  selectedItems={selectedFormFactors}
                  onItemToggle={handleFormFactorToggle}
                  isOpen={openDropdowns.has('keyboard-form-factors')}
                  onToggle={() => toggleDropdown('keyboard-form-factors')}
                />
              )}

              {availableLedTypes.length > 0 && (
                <DropdownFilter
                  label="Đèn LED"
                  icon="fas fa-lightbulb"
                  items={availableLedTypes}
                  selectedItems={selectedLedTypes}
                  onItemToggle={handleLedTypeToggle}
                  isOpen={openDropdowns.has('keyboard-led-types')}
                  onToggle={() => toggleDropdown('keyboard-led-types')}
                />
              )}

              {availableFeatures.length > 0 && (
                <DropdownFilter
                  label="Tiện ích"
                  icon="fas fa-star"
                  items={availableFeatures}
                  selectedItems={selectedFeatures}
                  onItemToggle={handleFeatureToggle}
                  isOpen={openDropdowns.has('keyboard-features')}
                  onToggle={() => toggleDropdown('keyboard-features')}
                />
              )}

              {/* Clear All Filters Button */}
              <button 
                className="clear-all-filters-btn"
                onClick={clearAllFilters}
              >
                <i className="fas fa-times"></i>
                Xóa tất cả
              </button>
            </div>
          )}

          {/* Dropdown Filters for Mouse */}
          {selectedCategory === 'mouse' && (
            <div className="dropdown-filters">
              {availableBrands.length > 0 && (
                <DropdownFilter
                  label="Thương hiệu"
                  icon="fas fa-tags"
                  items={availableBrands}
                  selectedItems={selectedBrands}
                  onItemToggle={handleBrandToggle}
                  isOpen={openDropdowns.has('mouse-brands')}
                  onToggle={() => toggleDropdown('mouse-brands')}
                />
              )}

              {availableConnectionTypes.length > 0 && (
                <DropdownFilter
                  label="Kết nối"
                  icon="fas fa-plug"
                  items={availableConnectionTypes}
                  selectedItems={selectedConnectionTypes}
                  onItemToggle={handleConnectionTypeToggle}
                  isOpen={openDropdowns.has('mouse-connections')}
                  onToggle={() => toggleDropdown('mouse-connections')}
                />
              )}

              {availableCompatibility.length > 0 && (
                <DropdownFilter
                  label="Tương thích"
                  icon="fas fa-desktop"
                  items={availableCompatibility}
                  selectedItems={selectedCompatibility}
                  onItemToggle={handleCompatibilityToggle}
                  isOpen={openDropdowns.has('mouse-compatibility')}
                  onToggle={() => toggleDropdown('mouse-compatibility')}
                />
              )}

              {availableLedTypes.length > 0 && (
                <DropdownFilter
                  label="Đèn LED"
                  icon="fas fa-lightbulb"
                  items={availableLedTypes}
                  selectedItems={selectedLedTypes}
                  onItemToggle={handleLedTypeToggle}
                  isOpen={openDropdowns.has('mouse-led-types')}
                  onToggle={() => toggleDropdown('mouse-led-types')}
                />
              )}

              {availableFeatures.length > 0 && (
                <DropdownFilter
                  label="Tiện ích"
                  icon="fas fa-star"
                  items={availableFeatures}
                  selectedItems={selectedFeatures}
                  onItemToggle={handleFeatureToggle}
                  isOpen={openDropdowns.has('mouse-features')}
                  onToggle={() => toggleDropdown('mouse-features')}
                />
              )}

              {/* Clear All Filters Button */}
              <button 
                className="clear-all-filters-btn"
                onClick={clearAllFilters}
              >
                <i className="fas fa-times"></i>
                Xóa tất cả
              </button>
            </div>
          )}

          {/* Dropdown Filters for Headset */}
          {selectedCategory === 'headset' && (
            <div className="dropdown-filters">
              {availableBrands.length > 0 && (
                <DropdownFilter
                  label="Thương hiệu"
                  icon="fas fa-tags"
                  items={availableBrands}
                  selectedItems={selectedBrands}
                  onItemToggle={handleBrandToggle}
                  isOpen={openDropdowns.has('headset-brands')}
                  onToggle={() => toggleDropdown('headset-brands')}
                />
              )}

              {availableConnectionTypes.length > 0 && (
                <DropdownFilter
                  label="Cổng kết nối"
                  icon="fas fa-plug"
                  items={availableConnectionTypes}
                  selectedItems={selectedConnectionTypes}
                  onItemToggle={handleConnectionTypeToggle}
                  isOpen={openDropdowns.has('headset-connections')}
                  onToggle={() => toggleDropdown('headset-connections')}
                />
              )}

              {availableHeadsetTypes.length > 0 && (
                <DropdownFilter
                  label="Loại tai nghe"
                  icon="fas fa-headphones"
                  items={availableHeadsetTypes}
                  selectedItems={selectedHeadsetTypes}
                  onItemToggle={handleHeadsetTypeToggle}
                  isOpen={openDropdowns.has('headset-types')}
                  onToggle={() => toggleDropdown('headset-types')}
                />
              )}

              {availableUseCases.length > 0 && (
                <DropdownFilter
                  label="Nhu cầu sử dụng"
                  icon="fas fa-bullseye"
                  items={availableUseCases}
                  selectedItems={selectedUseCases}
                  onItemToggle={handleUseCaseToggle}
                  isOpen={openDropdowns.has('headset-use-cases')}
                  onToggle={() => toggleDropdown('headset-use-cases')}
                />
              )}

              {availableFeatures.length > 0 && (
                <DropdownFilter
                  label="Tính năng"
                  icon="fas fa-star"
                  items={availableFeatures}
                  selectedItems={selectedFeatures}
                  onItemToggle={handleFeatureToggle}
                  isOpen={openDropdowns.has('headset-features')}
                  onToggle={() => toggleDropdown('headset-features')}
                />
              )}

              {/* Clear All Filters Button */}
              <button 
                className="clear-all-filters-btn"
                onClick={clearAllFilters}
              >
                <i className="fas fa-times"></i>
                Xóa tất cả
              </button>
            </div>
          )}

          {/* Dropdown Filters for Monitor */}
          {selectedCategory === 'monitor' && (
            <div className="dropdown-filters">
              {availableBrands.length > 0 && (
                <DropdownFilter
                  label="Thương hiệu"
                  icon="fas fa-tags"
                  items={availableBrands}
                  selectedItems={selectedBrands}
                  onItemToggle={handleBrandToggle}
                  isOpen={openDropdowns.has('monitor-brands')}
                  onToggle={() => toggleDropdown('monitor-brands')}
                />
              )}

              {availableScreenSizes.length > 0 && (
                <DropdownFilter
                  label="Kích thước"
                  icon="fas fa-expand-arrows-alt"
                  items={availableScreenSizes}
                  selectedItems={selectedScreenSizes}
                  onItemToggle={handleScreenSizeToggle}
                  isOpen={openDropdowns.has('monitor-screen-sizes')}
                  onToggle={() => toggleDropdown('monitor-screen-sizes')}
                />
              )}

              {availableRefreshRates.length > 0 && (
                <DropdownFilter
                  label="Tần số quét"
                  icon="fas fa-tachometer-alt"
                  items={availableRefreshRates}
                  selectedItems={selectedRefreshRates}
                  onItemToggle={handleRefreshRateToggle}
                  isOpen={openDropdowns.has('monitor-refresh-rates')}
                  onToggle={() => toggleDropdown('monitor-refresh-rates')}
                />
              )}

              {availableResolutions.length > 0 && (
                <DropdownFilter
                  label="Độ phân giải"
                  icon="fas fa-tv"
                  items={availableResolutions}
                  selectedItems={selectedResolutions}
                  onItemToggle={handleResolutionToggle}
                  isOpen={openDropdowns.has('monitor-resolutions')}
                  onToggle={() => toggleDropdown('monitor-resolutions')}
                />
              )}

              {availableResponseTimes.length > 0 && (
                <DropdownFilter
                  label="Thời gian phản hồi"
                  icon="fas fa-clock"
                  items={availableResponseTimes}
                  selectedItems={selectedResponseTimes}
                  onItemToggle={handleResponseTimeToggle}
                  isOpen={openDropdowns.has('monitor-response-times')}
                  onToggle={() => toggleDropdown('monitor-response-times')}
                />
              )}

              {availablePanelTypes.length > 0 && (
                <DropdownFilter
                  label="Tấm nền"
                  icon="fas fa-layer-group"
                  items={availablePanelTypes}
                  selectedItems={selectedPanelTypes}
                  onItemToggle={handlePanelTypeToggle}
                  isOpen={openDropdowns.has('monitor-panel-types')}
                  onToggle={() => toggleDropdown('monitor-panel-types')}
                />
              )}

              {availableConnectionTypes.length > 0 && (
                <DropdownFilter
                  label="Cổng kết nối"
                  icon="fas fa-plug"
                  items={availableConnectionTypes}
                  selectedItems={selectedConnectionTypes}
                  onItemToggle={handleConnectionTypeToggle}
                  isOpen={openDropdowns.has('monitor-connection-types')}
                  onToggle={() => toggleDropdown('monitor-connection-types')}
                />
              )}

              {availableMonitorFeatures.length > 0 && (
                <DropdownFilter
                  label="Tính năng màn hình"
                  icon="fas fa-star"
                  items={availableMonitorFeatures}
                  selectedItems={selectedMonitorFeatures}
                  onItemToggle={handleMonitorFeatureToggle}
                  isOpen={openDropdowns.has('monitor-features')}
                  onToggle={() => toggleDropdown('monitor-features')}
                  multiColumn={true}
                />
              )}

              {/* Clear All Filters Button */}
              <button 
                className="clear-all-filters-btn"
                onClick={clearAllFilters}
              >
                <i className="fas fa-times"></i>
                Xóa tất cả
              </button>
            </div>
          )}

          {/* Dropdown Filters for USB */}
          {selectedCategory === 'usb' && (
            <div className="dropdown-filters">
              {availableBrands.length > 0 && (
                <DropdownFilter
                  label="Thương hiệu"
                  icon="fas fa-tags"
                  items={availableBrands}
                  selectedItems={selectedBrands}
                  onItemToggle={handleBrandToggle}
                  isOpen={openDropdowns.has('usb-brands')}
                  onToggle={() => toggleDropdown('usb-brands')}
                />
              )}

              {availableStorageCapacities.length > 0 && (
                <DropdownFilter
                  label="Dung lượng"
                  icon="fas fa-hdd"
                  items={availableStorageCapacities}
                  selectedItems={selectedStorageCapacities}
                  onItemToggle={handleStorageCapacityToggle}
                  isOpen={openDropdowns.has('usb-storage-capacities')}
                  onToggle={() => toggleDropdown('usb-storage-capacities')}
                />
              )}

              {availableUsbTypes.length > 0 && (
                <DropdownFilter
                  label="Loại USB"
                  icon="fa-brands fa-usb"
                  items={availableUsbTypes}
                  selectedItems={selectedUsbTypes}
                  onItemToggle={handleUsbTypeToggle}
                  isOpen={openDropdowns.has('usb-types')}
                  onToggle={() => toggleDropdown('usb-types')}
                />
              )}

              {availableReadSpeeds.length > 0 && (
                <DropdownFilter
                  label="Tốc độ đọc"
                  icon="fas fa-tachometer-alt"
                  items={availableReadSpeeds}
                  selectedItems={selectedReadSpeeds}
                  onItemToggle={handleReadSpeedToggle}
                  isOpen={openDropdowns.has('usb-read-speeds')}
                  onToggle={() => toggleDropdown('usb-read-speeds')}
                />
              )}

              {availableWriteSpeeds.length > 0 && (
                <DropdownFilter
                  label="Tốc độ ghi"
                  icon="fas fa-edit"
                  items={availableWriteSpeeds}
                  selectedItems={selectedWriteSpeeds}
                  onItemToggle={handleWriteSpeedToggle}
                  isOpen={openDropdowns.has('usb-write-speeds')}
                  onToggle={() => toggleDropdown('usb-write-speeds')}
                />
              )}

              {availableMemoryCardTypes.length > 0 && (
                <DropdownFilter
                  label="Loại thẻ nhớ"
                  icon="fas fa-sd-card"
                  items={availableMemoryCardTypes}
                  selectedItems={selectedMemoryCardTypes}
                  onItemToggle={handleMemoryCardTypeToggle}
                  isOpen={openDropdowns.has('usb-memory-card-types')}
                  onToggle={() => toggleDropdown('usb-memory-card-types')}
                />
              )}

              {/* Clear All Filters Button */}
              <button 
                className="clear-all-filters-btn"
                onClick={clearAllFilters}
              >
                <i className="fas fa-times"></i>
                Xóa tất cả
              </button>
            </div>
          )}

          {/* Dropdown Filters for Digital */}
          {selectedCategory === 'digital' && (
            <div className="dropdown-filters">
              {availableBrands.length > 0 && (
                <DropdownFilter
                  label="Thương hiệu"
                  icon="fas fa-tags"
                  items={availableBrands}
                  selectedItems={selectedBrands}
                  onItemToggle={handleBrandToggle}
                  isOpen={openDropdowns.has('digital-brands')}
                  onToggle={() => toggleDropdown('digital-brands')}
                />
              )}

              {availableContentTypes.length > 0 && (
                <DropdownFilter
                  label="Loại nội dung"
                  icon="fas fa-file-alt"
                  items={availableContentTypes}
                  selectedItems={selectedContentTypes}
                  onItemToggle={handleContentTypeToggle}
                  isOpen={openDropdowns.has('digital-content-types')}
                  onToggle={() => toggleDropdown('digital-content-types')}
                />
              )}

              {availableFormatTypes.length > 0 && (
                <DropdownFilter
                  label="Định dạng"
                  icon="fas fa-file-code"
                  items={availableFormatTypes}
                  selectedItems={selectedFormatTypes}
                  onItemToggle={handleFormatTypeToggle}
                  isOpen={openDropdowns.has('digital-format-types')}
                  onToggle={() => toggleDropdown('digital-format-types')}
                />
              )}

              {availableLicenseTypes.length > 0 && (
                <DropdownFilter
                  label="Loại giấy phép"
                  icon="fas fa-certificate"
                  items={availableLicenseTypes}
                  selectedItems={selectedLicenseTypes}
                  onItemToggle={handleLicenseTypeToggle}
                  isOpen={openDropdowns.has('digital-license-types')}
                  onToggle={() => toggleDropdown('digital-license-types')}
                />
              )}

              {availableSoftwareCompatibility.length > 0 && (
                <DropdownFilter
                  label="Tương thích"
                  icon="fas fa-desktop"
                  items={availableSoftwareCompatibility}
                  selectedItems={selectedSoftwareCompatibility}
                  onItemToggle={handleSoftwareCompatibilityToggle}
                  isOpen={openDropdowns.has('digital-software-compatibility')}
                  onToggle={() => toggleDropdown('digital-software-compatibility')}
                />
              )}

              {/* Clear All Filters Button */}
              <button 
                className="clear-all-filters-btn"
                onClick={clearAllFilters}
              >
                <i className="fas fa-times"></i>
                Xóa tất cả
              </button>
            </div>
          )}

          {/* Other Products Filters */}
          {selectedCategory === 'other' && (
            <div className="dropdown-filters">
              {availableBrands.length > 0 && (
                <DropdownFilter
                  label="Thương hiệu"
                  icon="fas fa-tags"
                  items={availableBrands}
                  selectedItems={selectedBrands}
                  onItemToggle={handleBrandToggle}
                  isOpen={openDropdowns.has('other-brands')}
                  onToggle={() => toggleDropdown('other-brands')}
                />
              )}

              {availableOtherPriceRanges.length > 0 && (
                <DropdownFilter
                  label="Khoảng giá"
                  icon="fas fa-dollar-sign"
                  items={availableOtherPriceRanges}
                  selectedItems={selectedPriceRanges}
                  onItemToggle={handleOtherPriceRangeToggle}
                  isOpen={openDropdowns.has('other-price-ranges')}
                  onToggle={() => toggleDropdown('other-price-ranges')}
                />
              )}

              {availableOtherProductTypes.length > 0 && (
                <DropdownFilter
                  label="Loại sản phẩm"
                  icon="fas fa-cube"
                  items={availableOtherProductTypes}
                  selectedItems={selectedProductTypes}
                  onItemToggle={handleOtherProductTypeToggle}
                  isOpen={openDropdowns.has('other-product-types')}
                  onToggle={() => toggleDropdown('other-product-types')}
                />
              )}

              {availableOtherMaterials.length > 0 && (
                <DropdownFilter
                  label="Chất liệu"
                  icon="fas fa-gem"
                  items={availableOtherMaterials}
                  selectedItems={selectedMaterials}
                  onItemToggle={handleOtherMaterialToggle}
                  isOpen={openDropdowns.has('other-materials')}
                  onToggle={() => toggleDropdown('other-materials')}
                />
              )}

              {/* Clear All Filters Button */}
              <button 
                className="clear-all-filters-btn"
                onClick={clearAllFilters}
              >
                <i className="fas fa-times"></i>
                Xóa tất cả
              </button>
            </div>
          )}

          {/* Basic Filters for other categories */}
          {selectedCategory !== 'all' && selectedCategory !== 'keyboard' && selectedCategory !== 'mouse' && selectedCategory !== 'headset' && selectedCategory !== 'monitor' && selectedCategory !== 'usb' && selectedCategory !== 'digital' && selectedCategory !== 'other' && (
            <div className="advanced-filters">
              {/* Brand Filter */}
              {availableBrands.length > 0 && (
                <div className="filter-group">
                  <h4>
                    <i className="fas fa-tags"></i>
                    Thương hiệu
                  </h4>
                  <div className="filter-options">
                    {availableBrands.map((brand) => (
                      <label key={brand} className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandToggle(brand)}
                        />
                        <span className="checkmark"></span>
                        {brand}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Subcategory Filter */}
              {availableSubcategories.length > 0 && (
                <div className="filter-group">
                  <h4>
                    <i className="fas fa-layer-group"></i>
                    Loại sản phẩm
                  </h4>
                  <div className="filter-options">
                    {availableSubcategories.map((subcategory) => (
                      <label key={subcategory} className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedSubcategories.includes(subcategory)}
                          onChange={() => handleSubcategoryToggle(subcategory)}
                        />
                        <span className="checkmark"></span>
                        {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range Filter */}
              <div className="filter-group">
                <h4>
                  <i className="fas fa-dollar-sign"></i>
                  Khoảng giá
                </h4>
                <div className="filter-options">
                  {PRICE_RANGES.map((range) => (
                    <label key={range.label} className="filter-checkbox">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange === range.label}
                        onChange={() => handlePriceRangeChange(range.label)}
                      />
                      <span className="checkmark"></span>
                      {range.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedBrands.length > 0 || selectedSubcategories.length > 0 || selectedPriceRange) && (
                <div className="filter-actions">
                  <Button variant="secondary" onClick={clearAllFilters}>
                    Xóa bộ lọc
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="products-content">
          {/* Results Info */}
          <div className="results-info">
            <p>
              Hiển thị {displayedProducts.length} / {filteredProducts.length} sản phẩm
              {selectedCategory !== 'all' && (
                <span className="category-info">
                  {" "}trong danh mục {categories.find(c => c.id === selectedCategory)?.name}
                </span>
              )}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <>
              <div className="products-grid">
                {displayedProducts.map((product) => (
                  <SimpleProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={(id) => navigate(`/product/${id}`)}
                  />
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMoreProducts && (
                <div className="load-more-section">
                  <Button variant="secondary" onClick={handleLoadMore}>
                    <i className="fas fa-plus"></i>
                    Xem thêm {Math.min(LOAD_MORE_COUNT, filteredProducts.length - displayCount)} sản phẩm
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="no-products">
              <i className="fas fa-box-open"></i>
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedCategory('all');
                  clearAllFilters();
                }}
              >
                <i className="fas fa-refresh"></i>
                Xem tất cả sản phẩm
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
