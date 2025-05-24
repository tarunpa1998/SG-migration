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
  School,
  Globe,
  GraduationCap,
  BookOpen,
  Palmtree,
  Building
} from "lucide-react";
import RichTextEditor from "../RichTextEditor/RichTextEditor";

// University interface based on the MongoDB model
interface University {
  id: string;
  _id?: string;  // Support both formats
  name: string;
  description: string;
  shortDescription: string;
  slug: string;
  logo: string;
  country: string;
  location: string;
  established: string;
  type: string;
  rankings: {
    world: string;
    national: string;
  };
  tuitionFees: {
    undergraduate: string;
    postgraduate: string;
  };
  admissionRequirements: string;
  website: string;
  facilities: string[];
  programs: string[];
  applicationDeadlines: {
    undergraduate: string;
    postgraduate: string;
  };
  studentLife: string;
  image: string;
  featured: boolean;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

// Initial empty university for creating new items
const emptyUniversity: Omit<University, 'id' | '_id'> = {
  name: "",
  description: "",
  shortDescription: "",
  slug: "",
  logo: "",
  country: "",
  location: "",
  established: "",
  type: "",
  rankings: {
    world: "",
    national: ""
  },
  tuitionFees: {
    undergraduate: "",
    postgraduate: ""
  },
  admissionRequirements: "",
  website: "",
  facilities: [],
  programs: [],
  applicationDeadlines: {
    undergraduate: "",
    postgraduate: ""
  },
  studentLife: "",
  image: "",
  featured: false,
  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: []
  }
};

const UniversitiesAdmin = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUniversity, setCurrentUniversity] = useState<University | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [editForm, setEditForm] = useState<Omit<University, 'id' | '_id'>>(emptyUniversity);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const { toast } = useToast();

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/universities');
      if (!response.ok) {
        throw new Error('Failed to fetch universities');
      }

      const data = await response.json();
      setUniversities(data);
    } catch (error) {
      console.error('Error fetching universities:', error);
      toast({
        title: 'Error fetching universities',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setEditForm(emptyUniversity);
    setCurrentUniversity(null);
    setDialogOpen(true);
    setActiveTab("basic");
  };

  const handleEdit = (university: University) => {
    setIsEditing(true);
    setEditForm(university);
    setCurrentUniversity(university);
    setDialogOpen(true);
    setActiveTab("basic");
  };

  const handleDelete = async (universityId: string) => {
    if (!confirm('Are you sure you want to delete this university?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/admin/universities/${universityId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete university');
      }

      // Update the UI by removing the deleted university
      setUniversities(universities.filter(item => 
        (item._id !== universityId && item.id !== universityId)
      ));
      
      toast({
        title: 'University deleted',
        description: 'The university has been deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error deleting university:', error);
      toast({
        title: 'Error deleting university',
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
      if (!editForm.name || !editForm.description || !editForm.country) {
        throw new Error('Name, description, and country are required');
      }

      // Convert array fields from string to array if they're strings
      const processedForm = {
        ...editForm,
        facilities: Array.isArray(editForm.facilities) 
          ? editForm.facilities 
          : String(editForm.facilities).split(',').map(item => item.trim()).filter(Boolean),
        programs: Array.isArray(editForm.programs) 
          ? editForm.programs 
          : String(editForm.programs).split(',').map(item => item.trim()).filter(Boolean),
        seo: {
          ...editForm.seo,
          keywords: typeof editForm.seo.keywords === 'string' 
            ? String(editForm.seo.keywords).split(',').map(k => k.trim()).filter(Boolean) 
            : editForm.seo.keywords
        }
      };

      // Use the appropriate ID field (supporting both formats)
      const universityId = currentUniversity?.id || currentUniversity?._id;
      const url = isEditing
        ? `/api/admin/universities/${universityId}`
        : '/api/admin/universities';
      
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
        throw new Error(errorData.error || 'Failed to save university');
      }

      const savedUniversity = await response.json();
      
      if (isEditing) {
        // Update existing university in the list
        setUniversities(universities.map(item => {
          // Handle both ID formats by comparing with both
          const matchesId = item.id === savedUniversity.id || item._id === savedUniversity._id;
          return matchesId ? savedUniversity : item;
        }));
      } else {
        // Add new university to the list
        setUniversities([...universities, savedUniversity]);
      }
      
      setDialogOpen(false);
      toast({
        title: isEditing ? 'University updated' : 'University created',
        description: isEditing 
          ? 'The university has been updated successfully' 
          : 'A new university has been created successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error saving university:', error);
      toast({
        title: 'Error saving university',
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
      } else if (parentKey === 'rankings') {
        setEditForm({
          ...editForm,
          rankings: {
            ...editForm.rankings,
            [child]: value
          }
        });
      } else if (parentKey === 'tuitionFees') {
        setEditForm({
          ...editForm,
          tuitionFees: {
            ...editForm.tuitionFees,
            [child]: value
          }
        });
      } else if (parentKey === 'applicationDeadlines') {
        setEditForm({
          ...editForm,
          applicationDeadlines: {
            ...editForm.applicationDeadlines,
            [child]: value
          }
        });
      } else {
        setEditForm({
          ...editForm,
          [parent]: {
            ...editForm[parentKey],
            [child]: value
          }
        });
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

  const filteredUniversities = universities.filter(university => 
    university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    university.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    university.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Universities</h2>
          <p className="text-slate-500 mt-2">
            Manage universities and institutions
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add University
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search universities..."
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
                      <TableHead>Country</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUniversities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-slate-500 py-10">
                          No universities found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUniversities.map((university) => (
                        <TableRow key={university.id || university._id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              {university.logo && (
                                <img 
                                  src={university.logo} 
                                  alt={university.name} 
                                  className="w-6 h-6 mr-2 object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              )}
                              {university.name}
                            </div>
                          </TableCell>
                          <TableCell>{university.country}</TableCell>
                          <TableCell>{university.location}</TableCell>
                          <TableCell>{university.type}</TableCell>
                          <TableCell>
                            {university.featured ? (
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
                                onClick={() => handleEdit(university)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDelete(university.id || university._id || "")}
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
              {filteredUniversities.length === 0 ? (
                <div className="col-span-full text-center text-slate-500 py-10">
                  No universities found
                </div>
              ) : (
                filteredUniversities.map((university) => (
                  <Card key={university.id || university._id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        {university.logo && (
                          <img 
                            src={university.logo} 
                            alt={university.name} 
                            className="w-6 h-6 mr-2 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <span className="text-ellipsis overflow-hidden whitespace-nowrap" title={university.name}>
                          {university.name}
                        </span>
                      </CardTitle>
                      <CardDescription className="flex justify-between">
                        <span>{university.country}</span>
                        <span>{university.location}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 space-y-2">
                      <div className="flex items-center text-sm">
                        <Building className="h-4 w-4 mr-1 text-blue-600" />
                        <span>{university.type || 'Type not specified'}</span>
                      </div>
                      {university.rankings?.world && (
                        <div className="flex items-center text-sm">
                          <GraduationCap className="h-4 w-4 mr-1 text-orange-600" />
                          <span>World Ranking: {university.rankings.world}</span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="justify-between">
                      <div>
                        {university.featured && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(university)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(university.id || university._id || "")}
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

      {/* University Editor Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit University" : "Create New University"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Make changes to the university information"
                : "Add a new university to your platform"}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="admissions">Admissions</TabsTrigger>
              <TabsTrigger value="seo">SEO & Metadata</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">University Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    placeholder="University name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      value={editForm.country}
                      onChange={handleInputChange}
                      placeholder="Country"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">City/Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={editForm.location}
                      onChange={handleInputChange}
                      placeholder="City or location"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="established">Established</Label>
                    <Input
                      id="established"
                      name="established"
                      value={editForm.established}
                      onChange={handleInputChange}
                      placeholder="e.g. 1850"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">University Type</Label>
                    <Input
                      id="type"
                      name="type"
                      value={editForm.type}
                      onChange={handleInputChange}
                      placeholder="e.g. Public, Private, etc."
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
                    placeholder="Brief overview of the university"
                    required
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input
                      id="logo"
                      name="logo"
                      value={editForm.logo}
                      onChange={handleInputChange}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Featured Image URL</Label>
                    <Input
                      id="image"
                      name="image"
                      value={editForm.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">University Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={editForm.website}
                    onChange={handleInputChange}
                    placeholder="https://university.edu"
                  />
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
                    Feature this university (will be displayed prominently)
                  </Label>
                </div>
              </div>
            </TabsContent>

            {/* Academic Tab */}
            <TabsContent value="academic" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Full Description *</Label>
                  <RichTextEditor
                    content={editForm.description}
                    onChange={handleRichTextChange}
                    placeholder="Start writing detailed university description..."
                    className="min-h-[400px]"
                  />
                  <p className="text-xs text-slate-500">
                    Provide detailed information about the university, its history, strengths, etc.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rankings.world">World Ranking</Label>
                    <Input
                      id="rankings.world"
                      name="rankings.world"
                      value={editForm.rankings.world}
                      onChange={handleInputChange}
                      placeholder="e.g. #150"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rankings.national">National Ranking</Label>
                    <Input
                      id="rankings.national"
                      name="rankings.national"
                      value={editForm.rankings.national}
                      onChange={handleInputChange}
                      placeholder="e.g. #20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="programs">Academic Programs</Label>
                  <Textarea
                    id="programs"
                    name="programs"
                    value={Array.isArray(editForm.programs) 
                      ? editForm.programs.join(', ') 
                      : editForm.programs
                    }
                    onChange={handleInputChange}
                    placeholder="Business, Engineering, Medicine, etc."
                    rows={3}
                  />
                  <p className="text-xs text-slate-500">
                    Comma-separated list of programs or faculties
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facilities">Facilities</Label>
                  <Textarea
                    id="facilities"
                    name="facilities"
                    value={Array.isArray(editForm.facilities) 
                      ? editForm.facilities.join(', ') 
                      : editForm.facilities
                    }
                    onChange={handleInputChange}
                    placeholder="Library, Sports Center, Research Labs, etc."
                    rows={3}
                  />
                  <p className="text-xs text-slate-500">
                    Comma-separated list of campus facilities
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentLife">Student Life</Label>
                  <Textarea
                    id="studentLife"
                    name="studentLife"
                    value={editForm.studentLife}
                    onChange={handleInputChange}
                    placeholder="Information about student life, clubs, activities, etc."
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Admissions Tab */}
            <TabsContent value="admissions" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admissionRequirements">Admission Requirements</Label>
                  <Textarea
                    id="admissionRequirements"
                    name="admissionRequirements"
                    value={editForm.admissionRequirements}
                    onChange={handleInputChange}
                    placeholder="Details about admission requirements, exams, scores, etc."
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tuitionFees.undergraduate">Undergraduate Tuition</Label>
                    <Input
                      id="tuitionFees.undergraduate"
                      name="tuitionFees.undergraduate"
                      value={editForm.tuitionFees.undergraduate}
                      onChange={handleInputChange}
                      placeholder="e.g. $25,000 per year"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tuitionFees.postgraduate">Postgraduate Tuition</Label>
                    <Input
                      id="tuitionFees.postgraduate"
                      name="tuitionFees.postgraduate"
                      value={editForm.tuitionFees.postgraduate}
                      onChange={handleInputChange}
                      placeholder="e.g. $30,000 per year"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicationDeadlines.undergraduate">Undergraduate Deadlines</Label>
                    <Input
                      id="applicationDeadlines.undergraduate"
                      name="applicationDeadlines.undergraduate"
                      value={editForm.applicationDeadlines.undergraduate}
                      onChange={handleInputChange}
                      placeholder="e.g. January 15, Rolling basis"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="applicationDeadlines.postgraduate">Postgraduate Deadlines</Label>
                    <Input
                      id="applicationDeadlines.postgraduate"
                      name="applicationDeadlines.postgraduate"
                      value={editForm.applicationDeadlines.postgraduate}
                      onChange={handleInputChange}
                      placeholder="e.g. December 15, Rolling basis"
                    />
                  </div>
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
                  placeholder="SEO title (if different from university name)"
                />
                <p className="text-xs text-slate-500">
                  If left empty, the university name will be used
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
                  placeholder="university-url-slug"
                  required
                />
                <p className="text-xs text-slate-500">
                  The slug will be used in the university URL (e.g., /universities/university-url-slug)
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
                isEditing ? "Update University" : "Create University"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UniversitiesAdmin;