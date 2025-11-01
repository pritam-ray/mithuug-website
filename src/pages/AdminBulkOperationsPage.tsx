import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { supabase } from '../lib/supabase';
import { 
  Package, 
  ShoppingBag, 
  Upload, 
  Download, 
  CheckSquare,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  name: string;
  stock: number;
  price: number;
  is_new: boolean;
  is_bestseller: boolean;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
}

const AdminBulkOperationsPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'import'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Bulk update form states
  const [bulkStockChange, setBulkStockChange] = useState<number>(0);
  const [bulkStockOperation, setBulkStockOperation] = useState<'set' | 'add' | 'subtract'>('set');
  const [bulkPriceChange, setBulkPriceChange] = useState<number>(0);
  const [bulkPriceOperation, setBulkPriceOperation] = useState<'set' | 'increase' | 'decrease'>('set');
  const [bulkNewFlag, setBulkNewFlag] = useState<boolean | null>(null);
  const [bulkBestsellerFlag, setBulkBestsellerFlag] = useState<boolean | null>(null);
  const [bulkOrderStatus, setBulkOrderStatus] = useState<string>('');

  // CSV import
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);

  // Redirect if not admin
  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  // Load data
  useEffect(() => {
    if (activeTab === 'products') {
      loadProducts();
    } else if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, sku, name, stock, price, is_new, is_bestseller')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('id, order_number, status, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const toggleProductSelection = (id: string) => {
    const newSelection = new Set(selectedProducts);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedProducts(newSelection);
  };

  const toggleAllProducts = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map(p => p.id)));
    }
  };

  const toggleOrderSelection = (id: string) => {
    const newSelection = new Set(selectedOrders);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedOrders(newSelection);
  };

  const toggleAllOrders = () => {
    if (selectedOrders.size === orders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map(o => o.id)));
    }
  };

  const bulkUpdateProducts = async () => {
    if (selectedProducts.size === 0) {
      alert('Please select at least one product');
      return;
    }

    if (!confirm(`Update ${selectedProducts.size} product(s)?`)) {
      return;
    }

    try {
      setProcessing(true);

      for (const productId of selectedProducts) {
        const product = products.find(p => p.id === productId);
        if (!product) continue;

        const updates: any = {};

        // Update stock
        if (bulkStockChange !== 0 || bulkStockOperation === 'set') {
          switch (bulkStockOperation) {
            case 'set':
              updates.stock = bulkStockChange;
              break;
            case 'add':
              updates.stock = product.stock + bulkStockChange;
              break;
            case 'subtract':
              updates.stock = Math.max(0, product.stock - bulkStockChange);
              break;
          }
        }

        // Update price
        if (bulkPriceChange !== 0 || bulkPriceOperation === 'set') {
          switch (bulkPriceOperation) {
            case 'set':
              updates.price = bulkPriceChange;
              break;
            case 'increase':
              updates.price = product.price + bulkPriceChange;
              break;
            case 'decrease':
              updates.price = Math.max(0, product.price - bulkPriceChange);
              break;
          }
        }

        // Update flags
        if (bulkNewFlag !== null) {
          updates.is_new = bulkNewFlag;
        }
        if (bulkBestsellerFlag !== null) {
          updates.is_bestseller = bulkBestsellerFlag;
        }

        if (Object.keys(updates).length > 0) {
          const { error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', productId);

          if (error) throw error;
        }
      }

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'bulk_update_products',
        p_details: { count: selectedProducts.size, updates: { bulkStockOperation, bulkPriceOperation } }
      });

      alert(`Successfully updated ${selectedProducts.size} product(s)`);
      setSelectedProducts(new Set());
      loadProducts();
      
      // Reset form
      setBulkStockChange(0);
      setBulkPriceChange(0);
      setBulkNewFlag(null);
      setBulkBestsellerFlag(null);
    } catch (error) {
      console.error('Error updating products:', error);
      alert('Failed to update products');
    } finally {
      setProcessing(false);
    }
  };

  const bulkUpdateOrders = async () => {
    if (selectedOrders.size === 0) {
      alert('Please select at least one order');
      return;
    }

    if (!bulkOrderStatus) {
      alert('Please select a status');
      return;
    }

    if (!confirm(`Update ${selectedOrders.size} order(s) to ${bulkOrderStatus}?`)) {
      return;
    }

    try {
      setProcessing(true);

      for (const orderId of selectedOrders) {
        const { error } = await supabase
          .from('orders')
          .update({ 
            status: bulkOrderStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);

        if (error) throw error;
      }

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'bulk_update_orders',
        p_details: { count: selectedOrders.size, status: bulkOrderStatus }
      });

      alert(`Successfully updated ${selectedOrders.size} order(s)`);
      setSelectedOrders(new Set());
      loadOrders();
      setBulkOrderStatus('');
    } catch (error) {
      console.error('Error updating orders:', error);
      alert('Failed to update orders');
    } finally {
      setProcessing(false);
    }
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const preview = lines.slice(1, 6).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index];
        });
        return obj;
      });

      setCsvPreview(preview);
    };
    reader.readAsText(file);
  };

  const importCsv = async () => {
    if (!csvFile) {
      alert('Please select a CSV file');
      return;
    }

    if (!confirm('Import products from CSV? This will create new products.')) {
      return;
    }

    try {
      setProcessing(true);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        let imported = 0;
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const values = lines[i].split(',').map(v => v.trim());
          const product: any = {};
          
          headers.forEach((header, index) => {
            product[header] = values[index];
          });

          // Convert numeric fields
          if (product.price) product.price = parseFloat(product.price);
          if (product.stock) product.stock = parseInt(product.stock);
          if (product.is_new) product.is_new = product.is_new.toLowerCase() === 'true';
          if (product.is_bestseller) product.is_bestseller = product.is_bestseller.toLowerCase() === 'true';

          const { error } = await supabase
            .from('products')
            .insert(product);

          if (!error) imported++;
        }

        // Log admin activity
        await supabase.rpc('log_admin_activity', {
          p_action: 'import_products_csv',
          p_details: { count: imported }
        });

        alert(`Successfully imported ${imported} product(s)`);
        setCsvFile(null);
        setCsvPreview([]);
        setActiveTab('products');
        loadProducts();
      };
      reader.readAsText(csvFile);
    } catch (error) {
      console.error('Error importing CSV:', error);
      alert('Failed to import CSV');
    } finally {
      setProcessing(false);
    }
  };

  const exportProductsCsv = async () => {
    try {
      const csvContent = [
        ['sku', 'name', 'price', 'stock', 'category', 'is_new', 'is_bestseller'],
        ...products.map(p => [
          p.sku,
          p.name,
          p.price.toString(),
          p.stock.toString(),
          '',
          p.is_new.toString(),
          p.is_bestseller.toString()
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV');
    }
  };

  if (adminLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ochre"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-chocolate-900 mb-2">Bulk Operations</h1>
        <p className="text-chocolate-600">Perform bulk actions on products and orders</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b border-chocolate-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'products'
                ? 'border-b-2 border-ochre text-ochre'
                : 'text-chocolate-600 hover:text-chocolate-900'
            }`}
          >
            <Package size={20} />
            Products ({selectedProducts.size} selected)
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'orders'
                ? 'border-b-2 border-ochre text-ochre'
                : 'text-chocolate-600 hover:text-chocolate-900'
            }`}
          >
            <ShoppingBag size={20} />
            Orders ({selectedOrders.size} selected)
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'import'
                ? 'border-b-2 border-ochre text-ochre'
                : 'text-chocolate-600 hover:text-chocolate-900'
            }`}
          >
            <Upload size={20} />
            Import/Export
          </button>
        </div>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Bulk Actions Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-chocolate-900 mb-4">Bulk Update Products</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stock Update */}
              <div>
                <label className="block text-chocolate-700 font-medium mb-2">Stock Update</label>
                <div className="flex gap-2">
                  <select
                    value={bulkStockOperation}
                    onChange={(e) => setBulkStockOperation(e.target.value as any)}
                    className="px-4 py-2 border border-chocolate-300 rounded-lg"
                  >
                    <option value="set">Set to</option>
                    <option value="add">Add</option>
                    <option value="subtract">Subtract</option>
                  </select>
                  <input
                    type="number"
                    value={bulkStockChange}
                    onChange={(e) => setBulkStockChange(parseInt(e.target.value) || 0)}
                    className="flex-1 px-4 py-2 border border-chocolate-300 rounded-lg"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Price Update */}
              <div>
                <label className="block text-chocolate-700 font-medium mb-2">Price Update (₹)</label>
                <div className="flex gap-2">
                  <select
                    value={bulkPriceOperation}
                    onChange={(e) => setBulkPriceOperation(e.target.value as any)}
                    className="px-4 py-2 border border-chocolate-300 rounded-lg"
                  >
                    <option value="set">Set to</option>
                    <option value="increase">Increase by</option>
                    <option value="decrease">Decrease by</option>
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    value={bulkPriceChange}
                    onChange={(e) => setBulkPriceChange(parseFloat(e.target.value) || 0)}
                    className="flex-1 px-4 py-2 border border-chocolate-300 rounded-lg"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Flags */}
              <div>
                <label className="block text-chocolate-700 font-medium mb-2">New Product Flag</label>
                <select
                  value={bulkNewFlag === null ? '' : bulkNewFlag.toString()}
                  onChange={(e) => setBulkNewFlag(e.target.value === '' ? null : e.target.value === 'true')}
                  className="w-full px-4 py-2 border border-chocolate-300 rounded-lg"
                >
                  <option value="">No change</option>
                  <option value="true">Mark as New</option>
                  <option value="false">Remove New Flag</option>
                </select>
              </div>

              <div>
                <label className="block text-chocolate-700 font-medium mb-2">Bestseller Flag</label>
                <select
                  value={bulkBestsellerFlag === null ? '' : bulkBestsellerFlag.toString()}
                  onChange={(e) => setBulkBestsellerFlag(e.target.value === '' ? null : e.target.value === 'true')}
                  className="w-full px-4 py-2 border border-chocolate-300 rounded-lg"
                >
                  <option value="">No change</option>
                  <option value="true">Mark as Bestseller</option>
                  <option value="false">Remove Bestseller Flag</option>
                </select>
              </div>
            </div>

            <button
              onClick={bulkUpdateProducts}
              disabled={processing || selectedProducts.size === 0}
              className="mt-4 flex items-center gap-2 bg-ochre text-white px-6 py-3 rounded-lg hover:bg-ochre-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={20} />
              {processing ? 'Updating...' : `Update ${selectedProducts.size} Product(s)`}
            </button>
          </div>

          {/* Products List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-chocolate-200 flex justify-between items-center">
              <button
                onClick={toggleAllProducts}
                className="flex items-center gap-2 text-ochre hover:text-ochre-600"
              >
                <CheckSquare size={20} />
                {selectedProducts.size === products.length ? 'Deselect All' : 'Select All'}
              </button>
              <span className="text-chocolate-600">{products.length} products</span>
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-chocolate-200">
                <thead className="bg-chocolate-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedProducts.size === products.length && products.length > 0}
                        onChange={toggleAllProducts}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase">Flags</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-chocolate-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-chocolate-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-chocolate-900">{product.sku}</td>
                      <td className="px-6 py-4 text-sm text-chocolate-900">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-chocolate-900">{product.stock}</td>
                      <td className="px-6 py-4 text-sm text-chocolate-900">₹{product.price}</td>
                      <td className="px-6 py-4 text-sm">
                        {product.is_new && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1">New</span>}
                        {product.is_bestseller && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Bestseller</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Bulk Actions Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-chocolate-900 mb-4">Bulk Update Orders</h2>
            
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-chocolate-700 font-medium mb-2">Change Status To</label>
                <select
                  value={bulkOrderStatus}
                  onChange={(e) => setBulkOrderStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-chocolate-300 rounded-lg"
                >
                  <option value="">Select status...</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button
                onClick={bulkUpdateOrders}
                disabled={processing || selectedOrders.size === 0 || !bulkOrderStatus}
                className="flex items-center gap-2 bg-ochre text-white px-6 py-3 rounded-lg hover:bg-ochre-600 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={20} />
                {processing ? 'Updating...' : `Update ${selectedOrders.size} Order(s)`}
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-chocolate-200 flex justify-between items-center">
              <button
                onClick={toggleAllOrders}
                className="flex items-center gap-2 text-ochre hover:text-ochre-600"
              >
                <CheckSquare size={20} />
                {selectedOrders.size === orders.length ? 'Deselect All' : 'Select All'}
              </button>
              <span className="text-chocolate-600">{orders.length} orders</span>
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-chocolate-200">
                <thead className="bg-chocolate-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedOrders.size === orders.length && orders.length > 0}
                        onChange={toggleAllOrders}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase">Order Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-chocolate-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-chocolate-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.has(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-chocolate-900 font-medium">{order.order_number}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-chocolate-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Import/Export Tab */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          {/* Export */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-chocolate-900 mb-4 flex items-center gap-2">
              <Download size={20} />
              Export Products
            </h2>
            <p className="text-chocolate-600 mb-4">Download all products as CSV file</p>
            <button
              onClick={exportProductsCsv}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={20} />
              Export Products CSV
            </button>
          </div>

          {/* Import */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-chocolate-900 mb-4 flex items-center gap-2">
              <Upload size={20} />
              Import Products
            </h2>
            <p className="text-chocolate-600 mb-4">Upload CSV file to import products</p>
            
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">CSV Format</p>
                  <p className="text-sm">Required columns: sku, name, price, stock</p>
                  <p className="text-sm">Optional: category, is_new, is_bestseller</p>
                </div>
              </div>
            </div>

            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="block w-full text-sm text-chocolate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-ochre-50 file:text-ochre hover:file:bg-ochre-100 mb-4"
            />

            {csvPreview.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-chocolate-900 mb-2">Preview (first 5 rows)</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-chocolate-200">
                    <thead className="bg-chocolate-50">
                      <tr>
                        {Object.keys(csvPreview[0]).map(header => (
                          <th key={header} className="px-4 py-2 text-left text-xs font-medium text-chocolate-700 uppercase">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-chocolate-200">
                      {csvPreview.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value: any, i) => (
                            <td key={i} className="px-4 py-2 text-sm text-chocolate-900">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <button
              onClick={importCsv}
              disabled={!csvFile || processing}
              className="flex items-center gap-2 bg-ochre text-white px-6 py-3 rounded-lg hover:bg-ochre-600 transition-colors disabled:opacity-50"
            >
              <Upload size={20} />
              {processing ? 'Importing...' : 'Import CSV'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBulkOperationsPage;
