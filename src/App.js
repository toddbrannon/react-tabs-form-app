import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState({
    cityCounty: '', 
    population: '', 
    currentCompost: { volume: '', cost: '', unit: '' },
    currentMulch: { volume: '', cost: '', unit: '' },
    currentRNG: { volume: '', cost: '', unit: '' },
    currentBiomass: { volume: '', cost: '', unit: '' },
    currentOther: { volume: '', cost: '', unit: '' },
  });

  const handleNext = () => {
    if (activeTab < 3) setActiveTab(activeTab + 1);
  };

  const handleBack = () => {
    if (activeTab > 1) setActiveTab(activeTab - 1);
  };

  const handleCurrencyChange = (e, item) => {
    const { name, value } = e.target;
    
    // Remove all non-numeric characters except for the decimal point
    let numericValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const decimalCount = (numericValue.match(/\./g) || []).length;
    if (decimalCount > 1) {
      numericValue = numericValue.replace(/\.$/, ''); // Remove the last decimal if there are multiple
    }
  
    // If the value is empty or just a decimal point, set it to '0'
    if (numericValue === '' || numericValue === '.') numericValue = '0';
  
    // Parse the number, allowing for large numbers
    const number = parseFloat(numericValue);
  
    // Format to currency, but ensure it can handle large numbers
    const formattedValue = formatToCurrency(number);
  
    setFormData(prev => ({
      ...prev,
      [`current${item}`]: {
        ...prev[`current${item}`],
        cost: formattedValue
      }
    }));
  
    // Update the input value with the numeric value for calculations
    e.target.value = numericValue;
  };
  
  // Ensure formatToCurrency can handle large numbers
  function formatToCurrency(amount) {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      // Use maximumSignificantDigits instead of maximumFractionDigits for larger numbers
      maximumSignificantDigits: 21, // This allows for very large numbers while still showing cents
      minimumFractionDigits: 2,
    }).format(amount);
  }

  const handleChange = (e) => {
    console.log('Change event triggered for:', e.target.name, 'with value:', e.target.value);
    const { name, value } = e.target;
    if (['volume', 'cost', 'unit'].includes(name.split('-')[1])) {
      const [prefix, type] = name.split('-');
      setFormData(prev => {
        const newState = {
          ...prev,
          [prefix]: { ...prev[prefix], [type]: value }
        };
        console.log('New state for', name, ':', newState);
        return newState;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validatePopulation = (value) => {
    return Number.isInteger(Number(value)) && Number(value) > 0;
  };

  return (
    <div className="App">
      <img src="/logo.png" alt="Logo" style={{ width: '100px', margin: '20px auto', display: 'block' }} />
      <h1 className="title">Valinor Energy</h1>
      <div className="background-div">       
        <div className="card">
          <h2>SB 1383 Compliance Calculator</h2>
          <div className="tabs">
            <button className={activeTab === 1 ? 'active' : ''}>Step 1: Enter Data</button>
            <button className={activeTab === 2 ? 'active' : ''}>Step 2: View Results</button>
            <button className={activeTab === 3 ? 'active' : ''}>Step 3: Next Steps</button>
          </div>

          <div className="tab-content">
            {activeTab === 1 && (
              <form>
                <h3>Jurisdiction Information</h3>
                <div className="input-group">
                <div className="input-wrapper">
                <input 
                  type="text" 
                  name="cityCounty" 
                  value={formData.cityCounty} 
                  onChange={handleChange} 
                  required
                  // placeholder="City/County" 
                />
                <label>City/County</label>
                </div>
                <div className="input-wrapper">
                <input 
                  type="text" 
                  name="population" 
                  value={formData.population} 
                  onChange={handleChange} 
                  // placeholder="Population" 
                  required
                  style={{ borderColor: formData.population && !validatePopulation(formData.population) ? 'red' : '' }}
                />
                <label>Population</label>
                </div>
              </div>          
                <button type="button" onClick={handleNext} disabled={!validatePopulation(formData.population)}>Next</button>
              </form>
            )}
            {activeTab === 2 && (
              <form>
                <div className="city-county-info">
                  <h4>City/County: {formData.cityCounty}</h4>
                  <h4>Population: {formData.population ? parseInt(formData.population).toLocaleString() : ''}</h4>
                  <h3>SB 1383 ROWP Procurement Requirement</h3>
                  <p>Note: SB1383 requirement is .08 tons per person</p>
                  <div class="results-grid">
                    <div class="grid-header">2024</div>
                    <div class="grid-header">2025 and beyond</div>
                    <div class="grid-cell">{(formData.population * 0.8 * 0.65).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    <div class="grid-cell">{(formData.population * 0.8).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
              </div>
              <h2 className="procurement-details">Procurement Details</h2>
                {['Compost', 'Mulch', 'RNG', 'Biomass', 'Other'].map(item => (
                  <div key={item} className="procurement-item">
                    <h3 className="left-justify current-procurement">Current Procurement of {item}</h3>
                    <div className="input-group">
                      <div className="input-wrapper">
                        <input 
                          type="text" 
                          name={`current${item}-volume`} 
                          id={`current${item}-volume`}
                          value={formData[`current${item}`].volume} 
                          onChange={handleChange} 
                          placeholder="0" 
                          defaultValue="0" // Set default value here
                          required
                        />
                        <label className="default-label" for={`current${item}-volume`}>{`Volume of ${item}`}</label>
                        <label className="mobile-label" for={`current${item}-volume`}>Volume</label>
                      </div>
                      <div className="select-wrapper">
                      <label className="unit-label">Unit</label>
                        <select 
                          name={`current${item}-unit`}
                          value={formData[`current${item}`].unit}
                          onChange={handleChange}
                          required
                        >
                          
                          <option className="option-value" value="" hidden>Select</option>
                          
                          {['tons', 'cubic yards', 'ton', 'DGE', 'kWh', 'therms'].map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        
                          ))}
                        </select>
                        
                      </div>
                      
                      <div className="input-wrapper">
                        <input 
                          type="text" 
                          name={`current${item}-cost`} 
                          id={`current${item}-cost`}
                          value={formData[`current${item}`].cost} 
                          onChange={(e) => handleCurrencyChange(e, item)}  
                          placeholder="0" 
                          defaultValue="0"
                          required
                          onBlur={(e) => {
                            if (e.target.value === '$0.00') {
                              e.target.value = ''; // Clear the field if it's just the default value
                            }
                          }}
                        />
                        <label className="default-label" for={`current${item}-cost`}>{`Current Cost of ${item}`}</label>
                        <label className="mobile-label" for={`current${item}-cost`}>Cost</label>
                      </div>
                    </div>
                  </div>
                ))}
              <button type="button" onClick={handleBack}>Back</button>
              <button type="button" onClick={handleNext}>Next</button>
            </form>
          )}

        {activeTab === 3 && (
          <div>
            <h2>Review</h2>
            <p>City/County: {formData.cityCounty}</p>
            <p>Population: {formData.population}</p>
            {Object.entries(formData).filter(([key]) => key.startsWith('current')).map(([key, value]) => {    
                  <div key={key}>
                    <p>{key.replace('current', '').replace(/([A-Z])/g, ' $1').trim()}:</p>
                    <p>Volume: {value.volume}</p>
                    <p>Unit: {value.unit}</p>
                    <p>Cost: {value.cost}</p>
                  </div>
            })}
            <button type="button" onClick={handleBack}>Back</button>
            <button type="Get More Info" className="cta-button">Submit</button>
          </div>
        )}
      </div>
    </div>
  </div>
</div>
  );
}

export default App;