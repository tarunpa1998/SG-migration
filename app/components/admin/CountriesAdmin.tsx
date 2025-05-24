'use client';

import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Loader2, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  FileText, 
  LayoutGrid,
  Globe,
  Landmark,
  MapPin
} from "lucide-react";
import RichTextEditor from "../RichTextEditor/RichTextEditor";

// Country interface based on the MongoDB model
interface Country {
  id: string;
  _id?: string;  // Support both formats
  name: string;
  description: string;
  shortDescription: string;
  slug: string;
  flag: string;
  continent: string;
  languagesSpoken: string[];
  universities: number;
  costOfLiving: string;
  popularCities: string[];
  educationSystem: string;
  visaRequirements: string;
  scholarships: string[];
  image: string;
  featured: boolean;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

// Initial empty country for creating new items
const emptyCountry: Omit<Country, 'id' | '_id'> = {
  name: "",
  description: "",
  shortDescription: "",
  slug: "",
  flag: "",
  continent: "",
  languagesSpoken: [],
  universities: 0,
  costOfLiving: "",
  popularCities: [],
  educationSystem: "",
  visaRequirements: "",
  scholarships: [],
  image: "",
  featured: false,
  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: []
  }
};

const CountriesAdmin = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [editForm, setEditForm] = useState<Omit<Country, 'id' | '_id'>>(emptyCountry);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const { toast } = useToast();

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/countries');
      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }

      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast({
        title: 'Error fetching countries',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setEditForm(emptyCountry);
    setCurrentCountry(null);
    setDialogOpen(true);
    setActiveTab("basic");
  };

  const handleEdit = (country: Country) => {
    setIsEditing(true);
    setEditForm(country);
    setCurrentCountry(country);
    setDialogOpen(true);
    setActiveTab("basic");
  };

  const handleDelete = async (countryId: string) => {
    if (!confirm('Are you sure you want to delete this country?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/admin/countries/${countryId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete country');
      }

      // Update the UI by removing the deleted country
      setCountries(countries.filter(item => 
        (item._id !== countryId && item.id !== countryId)
      ));
      
      toast({
        title: 'Country deleted',
        description: 'The country has been deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error deleting country:', error);
      toast({
        title: 'Error deleting country',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Make sure we have required fields
      if (!editForm.name || !editForm.description) {
        throw new Error('Name and description are required');
      }

      // Convert array fields from string to array if they're strings
      const processedForm = {
        ...editForm,
        languagesSpoken: Array.isArray(editForm.languagesSpoken) 
          ? editForm.languagesSpoken 
          : String(editForm.languagesSpoken).split(',').map(item => item.trim()).filter(Boolean),
        popularCities: Array.isArray(editForm.popularCities) 
          ? editForm.popularCities 
          : String(editForm.popularCities).split(',').map(item => item.trim()).filter(Boolean),
        scholarships: Array.isArray(editForm.scholarships) 
          ? editForm.scholarships 
          : String(editForm.scholarships).split(',').map(item => item.trim()).filter(Boolean),
        seo: {
          ...editForm.seo,
          keywords: typeof editForm.seo.keywords === 'string' 
            ? String(editForm.seo.keywords).split(',').map(k => k.trim()).filter(Boolean) 
            : editForm.seo.keywords
        }
      };

      // Use the appropriate ID field (supporting both formats)
      const countryId = currentCountry?.id || currentCountry?._id;
      const url = isEditing
        ? `/api/admin/countries/${countryId}`
        : '/api/admin/countries';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(processedForm)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save country');
      }

      const savedCountry = await response.json();
      
      if (isEditing) {
        // Update existing country in the list
        setCountries(countries.map(item => {
          // Handle both ID formats by comparing with both
          const matchesId = item.id === savedCountry.id || item._id === savedCountry._id;
          return matchesId ? savedCountry : item;
        }));
      } else {
        // Add new country to the list
        setCountries([...countries, savedCountry]);
      }
      
      setDialogOpen(false);
      toast({
        title: isEditing ? 'Country updated' : 'Country created',
        description: isEditing 
          ? 'The country has been updated successfully' 
          : 'A new country has been created successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error saving country:', error);
      toast({
        title: 'Error saving country',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      const parentKey = parent as keyof typeof editForm;
      
      if (parentKey === 'seo') {
        setEditForm({
          ...editForm,
          seo: {
            ...editForm.seo,
            [child]: value
          }
        });
      } else {
        // Check if the parent property exists and is an object before spreading
        const parentValue = editForm[parentKey];
        if (parentValue && typeof parentValue === 'object' && !Array.isArray(parentValue)) {
          // Use type assertion to tell TypeScript this is a Record<string, any>
          const safeParentValue = parentValue as Record<string, any>;
          setEditForm({
            ...editForm,
            [parent]: {
              ...safeParentValue,
              [child]: value
            }
          });
        } else {
          // If parent doesn't exist or isn't an object, create a new object
          setEditForm({
            ...editForm,
            [parent]: {
              [child]: value
            }
          });
        }
      }
    } else {
      setEditForm({
        ...editForm,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setEditForm({
      ...editForm,
      [name]: checked
    });
  };
  
  const handleRichTextChange = (content: string) => {
    setEditForm({
      ...editForm,
      description: content
    });
  };

  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.continent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Countries</h2>
          <p className="text-slate-500 mt-2">
            Manage study destination countries
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Country
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search countries..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
        </div>
      ) : (
        <>
          {viewMode === "list" ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Continent</TableHead>
                      <TableHead>Universities</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCountries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-slate-500 py-10">
                          No countries found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCountries.map((country) => (
                        <TableRow key={country.id || country._id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              {country.flag && (
                                <span className="mr-2 text-xl">{country.flag}</span>
                              )}
                              {country.name}
                            </div>
                          </TableCell>
                          <TableCell>{country.continent}</TableCell>
                          <TableCell>{country.universities}</TableCell>
                          <TableCell>
                            {country.featured ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                                No
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(country)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDelete(country.id || country._id || "")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCountries.length === 0 ? (
                <div className="col-span-full text-center text-slate-500 py-10">
                  No countries found
                </div>
              ) : (
                filteredCountries.map((country) => (
                  <Card key={country.id || country._id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        {country.flag && (
                          <span className="mr-2 text-xl">{country.flag}</span>
                        )}
                        <span className="text-ellipsis overflow-hidden whitespace-nowrap" title={country.name}>
                          {country.name}
                        </span>
                      </CardTitle>
                      <CardDescription>{country.continent}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 space-y-2">
                      <div className="flex items-center text-sm">
                        <Landmark className="h-4 w-4 mr-1 text-blue-600" />
                        <span>{country.universities} Universities</span>
                      </div>
                      {country.popularCities?.length > 0 && (
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-1 text-orange-600" />
                          <span className="line-clamp-1">
                            {Array.isArray(country.popularCities) 
                              ? country.popularCities.slice(0, 3).join(', ') 
                              : country.popularCities
                            }
                            {Array.isArray(country.popularCities) && country.popularCities.length > 3 && '...'}
                          </span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="justify-between">
                      <div>
                        {country.featured && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(country)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(country.id || country._id || "")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Country Editor Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Country" : "Create New Country"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Make changes to the country information"
                : "Add a new study destination country to your platform"}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Education Details</TabsTrigger>
              <TabsTrigger value="seo">SEO & Metadata</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Country Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      placeholder="Country name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flag">Flag Emoji</Label>
                    <Input
                      id="flag"
                      name="flag"
                      value={editForm.flag}
                      onChange={handleInputChange}
                      placeholder="🇺🇸"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="continent">Continent *</Label>
                    <Input
                      id="continent"
                      name="continent"
                      value={editForm.continent}
                      onChange={handleInputChange}
                      placeholder="e.g. Europe, North America, etc."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="universities">Number of Universities</Label>
                    <Input
                      id="universities"
                      name="universities"
                      type="number"
                      value={editForm.universities}
                      onChange={handleInputChange}
                      placeholder="e.g. 200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Textarea
                    id="shortDescription"
                    name="shortDescription"
                    value={editForm.shortDescription}
                    onChange={handleInputChange}
                    placeholder="Brief overview of the country as a study destination"
                    required
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Country Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={editForm.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="languagesSpoken">Languages Spoken</Label>
                  <Input
                    id="languagesSpoken"
                    name="languagesSpoken"
                    value={Array.isArray(editForm.languagesSpoken) 
                      ? editForm.languagesSpoken.join(', ') 
                      : editForm.languagesSpoken
                    }
                    onChange={handleInputChange}
                    placeholder="English, French, etc."
                  />
                  <p className="text-xs text-slate-500">
                    Comma-separated list of languages
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="popularCities">Popular Cities</Label>
                  <Input
                    id="popularCities"
                    name="popularCities"
                    value={Array.isArray(editForm.popularCities) 
                      ? editForm.popularCities.join(', ') 
                      : editForm.popularCities
                    }
                    onChange={handleInputChange}
                    placeholder="New York, Los Angeles, etc."
                  />
                  <p className="text-xs text-slate-500">
                    Comma-separated list of cities
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={editForm.featured}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('featured', checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="featured"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Feature this country (will be displayed prominently)
                  </Label>
                </div>
              </div>
            </TabsContent>

            {/* Education Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Full Description *</Label>
                  <RichTextEditor
                    content={editForm.description}
                    onChange={handleRichTextChange}
                    placeholder="Start writing detailed country description..."
                    className="min-h-[400px]"
                  />
                  <p className="text-xs text-slate-500">
                    Provide detailed information about the country as a study destination
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="educationSystem">Education System</Label>
                  <Textarea
                    id="educationSystem"
                    name="educationSystem"
                    value={editForm.educationSystem}
                    onChange={handleInputChange}
                    placeholder="Describe the education system in the country"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costOfLiving">Cost of Living</Label>
                  <Textarea
                    id="costOfLiving"
                    name="costOfLiving"
                    value={editForm.costOfLiving}
                    onChange={handleInputChange}
                    placeholder="Typical cost of living for international students"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visaRequirements">Visa Requirements</Label>
                  <Textarea
                    id="visaRequirements"
                    name="visaRequirements"
                    value={editForm.visaRequirements}
                    onChange={handleInputChange}
                    placeholder="Information about student visa requirements"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scholarships">Notable Scholarships</Label>
                  <Input
                    id="scholarships"
                    name="scholarships"
                    value={Array.isArray(editForm.scholarships) 
                      ? editForm.scholarships.join(', ') 
                      : editForm.scholarships
                    }
                    onChange={handleInputChange}
                    placeholder="Name of scholarship programs for this country"
                  />
                  <p className="text-xs text-slate-500">
                    Comma-separated list of notable scholarship programs
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo.metaTitle">Meta Title</Label>
                <Input
                  id="seo.metaTitle"
                  name="seo.metaTitle"
                  value={editForm.seo.metaTitle}
                  onChange={handleInputChange}
                  placeholder="SEO title (if different from country name)"
                />
                <p className="text-xs text-slate-500">
                  If left empty, the country name will be used
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo.metaDescription">Meta Description</Label>
                <Textarea
                  id="seo.metaDescription"
                  name="seo.metaDescription"
                  value={editForm.seo.metaDescription}
                  onChange={handleInputChange}
                  placeholder="SEO description"
                  rows={3}
                />
                <p className="text-xs text-slate-500">
                  If left empty, the short description will be used
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo.keywords">Keywords</Label>
                <Input
                  id="seo.keywords"
                  name="seo.keywords"
                  value={Array.isArray(editForm.seo.keywords) 
                    ? editForm.seo.keywords.join(', ') 
                    : editForm.seo.keywords
                  }
                  onChange={handleInputChange}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-slate-500">
                  Comma-separated list of keywords
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={editForm.slug}
                  onChange={handleInputChange}
                  placeholder="country-url-slug"
                  required
                />
                <p className="text-xs text-slate-500">
                  The slug will be used in the country URL (e.g., /countries/country-url-slug)
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditing ? "Update Country" : "Create Country"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CountriesAdmin;
