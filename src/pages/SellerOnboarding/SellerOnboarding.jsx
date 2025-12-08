import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Check, Building2, MapPin, Landmark, User, ChevronDown, ChevronUp, HelpCircle, Phone, ExternalLink } from 'lucide-react';
import authService from '../../services/authService';
import { login } from '../../redux/slices/authSlice';

// Steps configuration
const STEPS = [
  { id: 1, name: 'Business Details', icon: Building2 },
  { id: 2, name: 'Pickup Address', icon: MapPin },
  { id: 3, name: 'Bank Details', icon: Landmark },
  { id: 4, name: 'Supplier Details', icon: User }
];

// FAQ Data
const FAQ_DATA = {
  1: [
    {
      question: 'Which sellers can sell on Meesho?',
      answer: 'Starting October 1st, 2023, sellers (with or without GST registration) can sell on Meesho. Non-GST sellers must obtain an Enrolment ID/UIN from the GST website.'
    },
    {
      question: 'How can I obtain GSTIN No or Enrolment ID / UIN?',
      answer: 'You can obtain GSTIN from the GST portal (gst.gov.in). For Enrolment ID, visit the GST registration page and apply for casual registration.'
    },
    {
      question: 'What is the difference between Enrolment ID / UIN and GSTIN?',
      answer: 'GSTIN is for registered GST taxpayers. Enrolment ID/UIN is for sellers who are not GST registered but want to sell online.'
    }
  ],
  2: [
    {
      question: 'Who will pick up the products for delivery?',
      answer: 'All products will be picked up by Meesho certified delivery partners from your location and delivered directly to the customer.'
    },
    {
      question: 'Do I need to pay the shipping charges?',
      answer: 'No, shipping charges are covered by Meesho. You just need to pack the products and hand them over to our delivery partner.'
    },
    {
      question: 'How can I change shipping state?',
      answer: 'You can update your pickup address anytime from your seller dashboard settings.'
    }
  ],
  3: [
    {
      question: 'When will I receive my payment?',
      answer: 'Payments are processed within 7-10 business days after successful order delivery.'
    },
    {
      question: 'What documents are needed for bank verification?',
      answer: 'You need to provide account holder name, account number, IFSC code, and a cancelled cheque or bank statement.'
    }
  ],
  4: [
    {
      question: 'What information is required?',
      answer: 'Basic supplier details like your display name, contact number, and store description.'
    },
    {
      question: 'Can I update these details later?',
      answer: 'Yes, you can update your supplier details anytime from your seller profile settings.'
    }
  ]
};

// Indian States
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh'
];

export default function SellerOnboarding() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  // Step 1: Business Details
  const [gstOption, setGstOption] = useState(null); // 'yes' or 'no'
  const [showGstForm, setShowGstForm] = useState(false);
  const [showEidForm, setShowEidForm] = useState(false);
  const [showEidCreateForm, setShowEidCreateForm] = useState(false);
  const [gstVerified, setGstVerified] = useState(false);
  const [eidVerified, setEidVerified] = useState(false);
  
  const [businessDetails, setBusinessDetails] = useState({
    gstin: '',
    enrolmentId: '',
    panNumber: '',
    fullName: '',
    email: '',
    state: '',
    pincode: '',
    district: '',
    city: '',
    buildingNumber: '',
    streetLocality: ''
  });
  
  // Step 2: Pickup Address
  const [useRegisteredAddress, setUseRegisteredAddress] = useState(true);
  const [pickupAddress, setPickupAddress] = useState({
    buildingNumber: '',
    streetLocality: '',
    landmark: '',
    pincode: '',
    city: '',
    state: ''
  });
  
  // Step 3: Bank Details
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    branch: ''
  });
  
  // Step 4: Supplier Details
  const [supplierDetails, setSupplierDetails] = useState({
    shopName: '',
    businessType: 'individual',
    description: '',
    contactNumber: ''
  });

  // Verify GSTIN (mock)
  const handleVerifyGstin = async () => {
    if (!businessDetails.gstin || businessDetails.gstin.length !== 15) {
      setError('Please enter valid 15-digit GSTIN');
      return;
    }
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setGstVerified(true);
      setBusinessDetails(prev => ({
        ...prev,
        fullName: 'Verified Business Name',
        state: 'Uttar Pradesh'
      }));
      setLoading(false);
      setSuccess('GSTIN verified successfully!');
    }, 1500);
  };

  // Verify Enrolment ID (mock)
  const handleVerifyEid = async () => {
    if (!businessDetails.enrolmentId || businessDetails.enrolmentId.length < 10) {
      setError('Please enter valid Enrolment ID / UIN');
      return;
    }
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setEidVerified(true);
      setBusinessDetails(prev => ({
        ...prev,
        fullName: 'Priya',
        panNumber: 'FGOPP2628J',
        state: 'Uttar Pradesh',
        city: 'Lakhimpur',
        district: 'Lakhimpur Kheri',
        pincode: '262701',
        buildingNumber: 'national public school',
        streetLocality: 'kashinagar'
      }));
      setLoading(false);
      setSuccess('Enrolment ID verified successfully!');
    }, 1500);
  };

  // Handle step navigation
  const handleContinue = async () => {
    setError('');
    setSuccess('');
    
    if (currentStep === 1) {
      if (!gstVerified && !eidVerified) {
        setError('Please verify your GSTIN or Enrolment ID first');
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!useRegisteredAddress) {
        if (!pickupAddress.buildingNumber || !pickupAddress.pincode || !pickupAddress.city || !pickupAddress.state) {
          setError('Please fill all required address fields');
          return;
        }
      }
    }
    
    if (currentStep === 3) {
      if (!bankDetails.accountHolderName || !bankDetails.accountNumber || !bankDetails.ifscCode) {
        setError('Please fill all required bank details');
        return;
      }
      if (bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
        setError('Account numbers do not match');
        return;
      }
    }
    
    if (currentStep === 4) {
      if (!supplierDetails.shopName || !supplierDetails.contactNumber) {
        setError('Please fill all required supplier details');
        return;
      }
      
      // Final submission
      await handleFinalSubmit();
      return;
    }
    
    setCurrentStep(prev => prev + 1);
  };

  // Final submit
  const handleFinalSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const sellerData = {
        shopName: supplierDetails.shopName,
        businessType: supplierDetails.businessType,
        description: supplierDetails.description,
        businessAddress: {
          addressLine1: useRegisteredAddress ? businessDetails.buildingNumber : pickupAddress.buildingNumber,
          addressLine2: useRegisteredAddress ? businessDetails.streetLocality : pickupAddress.streetLocality,
          city: useRegisteredAddress ? businessDetails.city : pickupAddress.city,
          state: useRegisteredAddress ? businessDetails.state : pickupAddress.state,
          pincode: useRegisteredAddress ? businessDetails.pincode : pickupAddress.pincode,
          country: 'India'
        },
        bankDetails: {
          accountHolderName: bankDetails.accountHolderName,
          accountNumber: bankDetails.accountNumber,
          ifscCode: bankDetails.ifscCode,
          bankName: bankDetails.bankName || 'Not Specified',
          branch: bankDetails.branch || ''
        },
        kycDocuments: {
          gst: { number: businessDetails.gstin || '' },
          panCard: { number: businessDetails.panNumber || '' }
        }
      };
      
      // Call API to create/update seller profile
      const response = await authService.createSellerProfile(sellerData);
      
      if (response.success) {
        setSuccess('Seller registration completed successfully!');
        
        // Update user in redux with seller info
        const updatedUser = { 
          ...user, 
          sellerId: response.data.seller._id,
          sellerProfileComplete: true 
        };
        dispatch(login({ user: updatedUser, token: localStorage.getItem('authToken') }));
        
        // Navigate to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/seller');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Copy registered address to pickup address
  useEffect(() => {
    if (useRegisteredAddress && (gstVerified || eidVerified)) {
      setPickupAddress({
        buildingNumber: businessDetails.buildingNumber,
        streetLocality: businessDetails.streetLocality,
        landmark: '',
        pincode: businessDetails.pincode,
        city: businessDetails.city,
        state: businessDetails.state
      });
    }
  }, [useRegisteredAddress, gstVerified, eidVerified, businessDetails]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          meesho
        </h1>
      </header>

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-4 lg:p-8 gap-8">
        {/* Left Section - Main Form */}
        <div className="flex-1 lg:max-w-2xl">
          {/* Steps Indicator */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex justify-between items-center">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                
                return (
                  <div key={step.id} className="flex flex-col items-center flex-1">
                    <div className="flex items-center w-full">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                        ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                          isCurrent ? 'border-purple-600 text-purple-600 bg-purple-50' : 
                          'border-gray-300 text-gray-400'}
                      `}>
                        {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                      </div>
                      {index < STEPS.length - 1 && (
                        <div className={`flex-1 h-1 mx-2 rounded ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <span className={`text-xs mt-2 text-center hidden sm:block ${isCurrent ? 'text-purple-600 font-semibold' : 'text-gray-500'}`}>
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                {success}
              </div>
            )}

            {/* Step 1: Business Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Do you have a GST number?</h2>
                
                {/* GST Options */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setGstOption('yes');
                      setShowGstForm(true);
                      setShowEidForm(false);
                      setShowEidCreateForm(false);
                    }}
                    className={`p-4 border-2 rounded-xl text-left transition-all ${
                      gstOption === 'yes' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        gstOption === 'yes' ? 'border-purple-600' : 'border-gray-300'
                      }`}>
                        {gstOption === 'yes' && <div className="w-3 h-3 rounded-full bg-purple-600" />}
                      </div>
                      <span className="font-semibold">Yes</span>
                    </div>
                    <p className="text-sm text-gray-500 ml-8">Enter your GSTIN and sell anywhere easily</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setGstOption('no');
                      setShowGstForm(false);
                      setShowEidForm(true);
                    }}
                    className={`p-4 border-2 rounded-xl text-left transition-all ${
                      gstOption === 'no' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        gstOption === 'no' ? 'border-purple-600' : 'border-gray-300'
                      }`}>
                        {gstOption === 'no' && <div className="w-3 h-3 rounded-full bg-purple-600" />}
                      </div>
                      <span className="font-semibold">No</span>
                    </div>
                    <p className="text-sm text-gray-500 ml-8">
                      Worry not, you can sell without GST
                      <span className="text-purple-600 font-medium block">Get EID in mins ⚡</span>
                    </p>
                  </button>
                </div>

                {/* GSTIN Form */}
                {showGstForm && (
                  <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                    <h3 className="font-semibold">Enter your GSTIN</h3>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={businessDetails.gstin}
                        onChange={e => setBusinessDetails({...businessDetails, gstin: e.target.value.toUpperCase()})}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none uppercase"
                        placeholder="Enter 15-digit GSTIN"
                        maxLength={15}
                        disabled={gstVerified}
                      />
                      <button
                        onClick={handleVerifyGstin}
                        disabled={loading || gstVerified}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                          gstVerified 
                            ? 'bg-green-500 text-white' 
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        {gstVerified ? '✓ Verified' : loading ? 'Verifying...' : 'Verify'}
                      </button>
                    </div>
                    
                    {gstVerified && (
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-600 mb-1">Below details are linked to your GSTIN</p>
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs text-gray-500">Business Name</span>
                            <p className="font-semibold">{businessDetails.fullName}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">State</span>
                            <p className="font-semibold">{businessDetails.state}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Enrolment ID Section */}
                {showEidForm && (
                  <div className="space-y-4">
                    {/* Sell without GST accordion */}
                    <div className="border border-purple-200 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowEidCreateForm(!showEidCreateForm)}
                        className="w-full px-4 py-3 bg-purple-50 flex items-center justify-between text-left"
                      >
                        <div>
                          <span className="font-semibold text-purple-800">Sell without GST in minutes</span>
                          <p className="text-sm text-gray-600">We only need below details from you to create your enrolment ID</p>
                        </div>
                        {showEidCreateForm ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                      
                      {showEidCreateForm && (
                        <div className="p-4 space-y-3">
                          <div className="flex items-center gap-2 text-green-600">
                            <Check size={16} /> <span className="text-sm">PAN number</span>
                          </div>
                          <div className="flex items-center gap-2 text-green-600">
                            <Check size={16} /> <span className="text-sm">Full Name</span>
                          </div>
                          <div className="flex items-center gap-2 text-green-600">
                            <Check size={16} /> <span className="text-sm">Email ID</span>
                          </div>
                          <div className="flex items-center gap-2 text-green-600">
                            <Check size={16} /> <span className="text-sm">Full Address</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            By proceeding and providing your details, you confirm that you've read and agreed to the{' '}
                            <a href="#" className="text-purple-600 underline">TnC</a> and authorize Meesho to apply for an enrolment ID on your behalf
                          </p>
                          <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all">
                            Proceed to add details
                          </button>
                          <p className="text-sm text-center text-gray-500">
                            Or create it directly through the{' '}
                            <a href="https://reg.gst.gov.in/registration/generateuid" target="_blank" rel="noopener noreferrer" className="text-purple-600 underline inline-flex items-center gap-1">
                              GST website <ExternalLink size={14} />
                            </a>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Add existing Enrolment ID */}
                    <div className="border border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold mb-3">Add existing enrolment ID</h3>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={businessDetails.enrolmentId}
                          onChange={e => setBusinessDetails({...businessDetails, enrolmentId: e.target.value.toUpperCase()})}
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                          placeholder="Enter Enrolment ID / UIN"
                          disabled={eidVerified}
                        />
                        <button
                          onClick={handleVerifyEid}
                          disabled={loading || eidVerified}
                          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                            eidVerified 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-400 hover:bg-gray-500 text-white'
                          }`}
                        >
                          {eidVerified ? '✓ Verified' : loading ? 'Verifying...' : 'Verify'}
                        </button>
                      </div>
                      
                      {eidVerified && (
                        <div className="mt-4 space-y-3">
                          <p className="text-sm text-gray-600 font-medium">Below details are linked to your enrolment ID</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-xs text-gray-500">Name</span>
                              <p className="font-semibold border-l-4 border-purple-500 pl-2">{businessDetails.fullName}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">PAN Number</span>
                              <p className="font-semibold border-l-4 border-purple-500 pl-2">{businessDetails.panNumber}</p>
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Registered Business Address</span>
                            <p className="font-semibold border-l-4 border-purple-500 pl-2">
                              {businessDetails.buildingNumber}, {businessDetails.streetLocality}, 
                              {businessDetails.district}, Pincode - {businessDetails.pincode}, 
                              {businessDetails.city}, {businessDetails.state}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Pickup Address */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                  <span className="text-yellow-600">ℹ️</span>
                  <span className="text-sm">Products will be picked up from this location for delivery</span>
                </div>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useRegisteredAddress}
                    onChange={e => setUseRegisteredAddress(e.target.checked)}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="font-medium">Use address registered on Enrolment ID / UIN</span>
                </label>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Room/ Floor/ Building Number</label>
                      <input
                        type="text"
                        value={useRegisteredAddress ? businessDetails.buildingNumber : pickupAddress.buildingNumber}
                        onChange={e => setPickupAddress({...pickupAddress, buildingNumber: e.target.value})}
                        disabled={useRegisteredAddress}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Street/ Locality</label>
                      <input
                        type="text"
                        value={useRegisteredAddress ? businessDetails.streetLocality : pickupAddress.streetLocality}
                        onChange={e => setPickupAddress({...pickupAddress, streetLocality: e.target.value})}
                        disabled={useRegisteredAddress}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Landmark</label>
                    <input
                      type="text"
                      value={pickupAddress.landmark}
                      onChange={e => setPickupAddress({...pickupAddress, landmark: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                      placeholder="Landmark"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Pincode</label>
                      <input
                        type="text"
                        value={useRegisteredAddress ? businessDetails.pincode : pickupAddress.pincode}
                        onChange={e => setPickupAddress({...pickupAddress, pincode: e.target.value})}
                        disabled={useRegisteredAddress}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none disabled:bg-gray-50"
                        maxLength={6}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">City</label>
                      <input
                        type="text"
                        value={useRegisteredAddress ? businessDetails.city : pickupAddress.city}
                        onChange={e => setPickupAddress({...pickupAddress, city: e.target.value})}
                        disabled={useRegisteredAddress}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">State</label>
                    <input
                      type="text"
                      value={useRegisteredAddress ? businessDetails.state : pickupAddress.state}
                      disabled={useRegisteredAddress}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Bank Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Bank Account Details</h2>
                <p className="text-gray-600">Enter your bank details for receiving payments</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name *</label>
                    <input
                      type="text"
                      value={bankDetails.accountHolderName}
                      onChange={e => setBankDetails({...bankDetails, accountHolderName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                      placeholder="Name as per bank account"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
                    <input
                      type="text"
                      value={bankDetails.accountNumber}
                      onChange={e => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                      placeholder="Enter account number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Account Number *</label>
                    <input
                      type="text"
                      value={bankDetails.confirmAccountNumber}
                      onChange={e => setBankDetails({...bankDetails, confirmAccountNumber: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                      placeholder="Re-enter account number"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code *</label>
                      <input
                        type="text"
                        value={bankDetails.ifscCode}
                        onChange={e => setBankDetails({...bankDetails, ifscCode: e.target.value.toUpperCase()})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none uppercase"
                        placeholder="IFSC Code"
                        maxLength={11}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={bankDetails.bankName}
                        onChange={e => setBankDetails({...bankDetails, bankName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                        placeholder="Bank name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    <input
                      type="text"
                      value={bankDetails.branch}
                      onChange={e => setBankDetails({...bankDetails, branch: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                      placeholder="Branch name"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Supplier Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Supplier Details</h2>
                <p className="text-gray-600">Tell us about your business</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shop/Business Name *</label>
                    <input
                      type="text"
                      value={supplierDetails.shopName}
                      onChange={e => setSupplierDetails({...supplierDetails, shopName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                      placeholder="Enter your shop name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
                    <select
                      value={supplierDetails.businessType}
                      onChange={e => setSupplierDetails({...supplierDetails, businessType: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none bg-white"
                    >
                      <option value="individual">Individual</option>
                      <option value="proprietorship">Proprietorship</option>
                      <option value="partnership">Partnership</option>
                      <option value="private_limited">Private Limited</option>
                      <option value="public_limited">Public Limited</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                    <input
                      type="tel"
                      value={supplierDetails.contactNumber}
                      onChange={e => setSupplierDetails({...supplierDetails, contactNumber: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                      placeholder="+91 XXXXXXXXXX"
                      maxLength={10}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shop Description</label>
                    <textarea
                      value={supplierDetails.description}
                      onChange={e => setSupplierDetails({...supplierDetails, description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                      placeholder="Describe your business (optional)"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={loading || (currentStep === 1 && !gstVerified && !eidVerified)}
              className="w-full mt-8 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-xl font-semibold text-lg transition-all disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : currentStep === 4 ? 'Complete Registration' : 'Continue'}
            </button>
          </div>
        </div>

        {/* Right Section - Info Panel */}
        <div className="lg:w-96 space-y-6">
          {/* Stats Banner */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="text-3xl">🌟</div>
            <div>
              <p className="text-gray-800 font-medium">
                {currentStep === 2 
                  ? 'Meesho provides free shipping to 24,000+ pincodes in India'
                  : 'More than 100,000 suppliers are growing their business by selling on Meesho'}
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-purple-600 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {FAQ_DATA[currentStep]?.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-3">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between text-left py-2"
                  >
                    <span className="font-medium text-gray-800 pr-4">{faq.question}</span>
                    {expandedFaq === index ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                  </button>
                  {expandedFaq === index && (
                    <p className="text-sm text-gray-600 pb-2 pl-2">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Phone size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Need more assistance?</p>
                <p className="text-sm text-gray-600">Call us on 080 - 61799601</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <HelpCircle size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Need help with Enrolment ID/UIN creation?</p>
                <p className="text-sm text-gray-600">Call us on 080 - 61799601</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
